import JWT, { JwtPayload } from '../core/JWT';
import { TokenExpiredError, BadTokenError } from '../core/ApiError';

async function testJWTFunctionality() {
  try {
    console.log('🚀 Starting JWT Test...\n');

    // 1. Create a JWT payload
    const payload = new JwtPayload(
      'salonkatta', // issuer
      'salonkatta', // audience
      'user123', // subject (usually user id)
      'admin', // custom parameter (could be role)
      3600, // validity in seconds (1 hour)
    );

    console.log('📝 Created Payload:', payload);

    // 2. Encode (sign) the token
    const token = await JWT.encode(payload);
    console.log('\n🔑 Generated Token:', token);

    // 3. Validate the token
    const decodedValid = await JWT.validate(token);
    console.log('\n✅ Validated Token Payload:', decodedValid);

    // 4. Test expired token handling
    console.log('\n🕒 Testing Expired Token...');
    const expiredPayload = new JwtPayload(
      'salonkatta',
      'salonkatta',
      'user123',
      'admin',
      -3600, // negative validity to create expired token
    );

    const expiredToken = await JWT.encode(expiredPayload);

    try {
      await JWT.validate(expiredToken);
    } catch (error: unknown) {
      if (error instanceof TokenExpiredError) {
        console.log(
          '✅ Successfully caught expired token error:',
          error.message,
        );
      }
    }

    // 5. Decode expired token (should work despite expiration)
    const decodedExpired = await JWT.decode(expiredToken);
    console.log(
      '\n📖 Decoded Expired Token (decode still works):',
      decodedExpired,
    );

    // 6. Test invalid token
    console.log('\n❌ Testing Invalid Token...');
    const invalidToken = token + 'tampered';
    try {
      await JWT.validate(invalidToken);
    } catch (error: unknown) {
      if (error instanceof BadTokenError) {
        console.log(
          '✅ Successfully caught invalid token error:',
          error.message,
        );
      }
    }

    console.log('\n✨ JWT Test Completed Successfully!');
  } catch (error) {
    if (error instanceof Error) {
      console.error('\n🚨 Test Failed:', error.message);
    } else {
      console.error('\n🚨 Test Failed: Unknown error');
    }
  }
}

// Run the test
testJWTFunctionality();
