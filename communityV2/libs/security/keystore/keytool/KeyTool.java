import java.io.InputStream;
import java.security.KeyStore;
import java.security.SecureRandom;
import javax.crypto.SecretKey;
import java.math.BigInteger;
import java.io.FileInputStream;
import java.io.File;

public class KeyTool {
  public static void main(String[] args) {

    try {

      System.out.print(readFromKeystore(args[0], args[1], args[2]));

    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public static String readFromKeystore(String secretKeyPathName, String alias, String password) throws Exception {
    SecretKey secretKey = null;
    InputStream is = new FileInputStream(new File(secretKeyPathName));
    KeyStore keyStore = KeyStore.getInstance("JCEKS");
    keyStore.load(is, password.toCharArray());

    try {
      secretKey = (SecretKey) keyStore.getKey(alias, password.toCharArray());
      is.close();
      return new String(encodeHex(secretKey.getEncoded()));
    } catch (Exception ex) {
      System.out.println(ex);
    }

    if (is != null) {
      is.close();
    }
    return null;
  }

  public static char[] encodeHex(final byte[] data) {
    char[] toDigits =
        {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'};
    final int l = data.length;
    final char[] out = new char[l << 1];
    // two characters form the hex value.
    for (int i = 0, j = 0; i < l; i++) {
        out[j++] = toDigits[(0xF0 & data[i]) >>> 4];
        out[j++] = toDigits[0x0F & data[i]];
    }
    return out;
}
}
