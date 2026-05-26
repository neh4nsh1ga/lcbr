require 'openssl'
require 'digest'

def bin2hex(str)
  str.unpack('C*').map{ |b| "%02x" % b }.join('')
end

Jekyll::Hooks.register [:documents, :pages], :post_convert do |doc|
  password = doc.data['password']
  if password && !password.to_s.strip.empty?
    content = doc.content
    
    aes = OpenSSL::Cipher.new('AES-256-CBC')
    aes.encrypt
    salt = OpenSSL::Random.random_bytes(8)
    iv = aes.random_iv
    key = password.to_s.strip
    aes.key = Digest::SHA256.digest(key + bin2hex(salt))
    aes.iv = iv
    
    # Wrap content in a magic string to verify decryption
    magic_string = "0db9774b86aa5a219a0939cdd5c5aa08"
    content_to_encrypt = "<div id='#{magic_string}'>" + content + "</div>"
    
    encrypted = bin2hex(aes.update(content_to_encrypt) + aes.final).strip
    
    # Generate the replacement HTML
    replacement = <<-HTML
    <div id="secure-container" style="display:none;">#{encrypted}</div>
    <div id="decryptor" style="padding: 2em; border: 1px solid var(--border-color, #ccc); border-radius: 8px; text-align: center; margin: 2em 0;">
      <p>이 글은 비밀글입니다. 비밀번호를 입력해주세요.</p>
      <input id="key" type="password" placeholder="비밀번호" style="padding: 0.5em; border-radius: 4px; border: 1px solid #ccc; margin-right: 0.5em;">
      <input id="decrypt" type="button" value="확인" style="padding: 0.5em 1em; border-radius: 4px; cursor: pointer; background: #333; color: white; border: none;">
      <p id="decrypt-error" style="color: red; display: none; margin-top: 1em; font-size: 0.9em;">비밀번호가 올바르지 않습니다.</p>
    </div>
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/aes-js/3.1.2/index.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/js-sha256/0.9.0/sha256.js"></script>
    <script>
      var _gj = {salt: '#{bin2hex(salt)}', iv: '#{bin2hex(iv)}'};
      
      function decrypt(key) {
        var text = $('#secure-container').text().trim();
        var keyArray = sha256.update(key + _gj.salt).array();
        var iv = aesjs.utils.hex.toBytes(_gj.iv);
        var encryptedBytes = aesjs.utils.hex.toBytes(text);
        
        try {
          var aesCbc = new aesjs.ModeOfOperation.cbc(keyArray, iv);
          var decryptedBytes = aesCbc.decrypt(encryptedBytes);
          var final = aesjs.utils.utf8.fromBytes(decryptedBytes);
          
          if (final.includes("#{magic_string}")){
            var decryptedHtml = $('<div>').html(final).find('##{magic_string}').html();
            $('#decryptor').hide();
            $('#secure-container').html(decryptedHtml);
            $('#secure-container').fadeIn();
          } else {
            $('#decrypt-error').show();
          }
        } catch(e) {
          $('#decrypt-error').show();
        }
      }
      
      $(document).ready(function() {
        $('#decrypt').click(function() {
          decrypt($('#key').val());
        });
        $('#key').keypress(function(e){
          if(e.which == 13){
            decrypt($('#key').val());
          }
        });
      });
    </script>
    HTML
    
    doc.content = replacement
  end
end
