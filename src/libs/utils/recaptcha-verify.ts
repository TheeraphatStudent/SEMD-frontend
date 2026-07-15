interface RecaptchaVerifyResponse {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  'error-codes'?: string[];
}

interface VerifyResult {
  success: boolean;
  score: number;
  error?: string;
}

const DEFAULT_SCORE_THRESHOLD = 0.5;

export async function verifyRecaptcha(
  token: string,
  expectedAction?: string,
  scoreThreshold: number = DEFAULT_SCORE_THRESHOLD
): Promise<VerifyResult> {
  const secretKey = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    return {
      success: false,
      score: 0,
      error: 'reCAPTCHA secret key is not configured',
    };
  }

  if (!token) {
    return {
      success: false,
      score: 0,
      error: 'reCAPTCHA token is missing',
    };
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        score: 0,
        error: 'Failed to verify reCAPTCHA with Google',
      };
    }

    const data: RecaptchaVerifyResponse = await response.json();

    if (!data.success) {
      return {
        success: false,
        score: 0,
        error: `reCAPTCHA verification failed: ${data['error-codes']?.join(', ') || 'Unknown error'}`,
      };
    }

    if (expectedAction && data.action !== expectedAction) {
      return {
        success: false,
        score: data.score,
        error: `reCAPTCHA action mismatch: expected ${expectedAction}, got ${data.action}`,
      };
    }

    if (data.score < scoreThreshold) {
      return {
        success: false,
        score: data.score,
        error: `reCAPTCHA score too low: ${data.score} (threshold: ${scoreThreshold})`,
      };
    }

    return {
      success: true,
      score: data.score,
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error during reCAPTCHA verification';
    return {
      success: false,
      score: 0,
      error: errorMessage,
    };
  }
}
