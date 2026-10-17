export function resolveRazorpayMode(configuredMode, keyId) {
  const mode = configuredMode || 'test';
  if (mode !== 'test') {
    throw new Error('This checkout is restricted to Razorpay Test Mode');
  }

  if (!keyId?.startsWith('rzp_test_')) {
    throw new Error('Razorpay Test Mode requires a key ID beginning with "rzp_test_"');
  }
  return mode;
}

export function getRazorpayOrderFailure(error) {
  const details = typeof error === 'object' && error !== null
    ? error
    : {};
  const statusCode = 'statusCode' in details && typeof details.statusCode === 'number'
    ? details.statusCode
    : undefined;
  const apiError = 'error' in details && typeof details.error === 'object' && details.error !== null
    ? details.error
    : {};
  const code = 'code' in apiError && typeof apiError.code === 'string'
    ? apiError.code.slice(0, 80)
    : undefined;
  const description = 'description' in apiError && typeof apiError.description === 'string'
    ? apiError.description.slice(0, 200)
    : undefined;

  if (statusCode === 401) {
    return {
      statusCode,
      code,
      description,
      message: 'Razorpay rejected the Test Mode credentials. Use the Key ID and Key Secret from the same Razorpay Test Mode account, update .env, and restart the development server.',
    };
  }
  if (statusCode === 429) {
    return {
      statusCode,
      code,
      description,
      message: 'Razorpay is receiving too many requests. Wait a moment and try again.',
    };
  }
  if (statusCode !== undefined && statusCode >= 500) {
    return {
      statusCode,
      code,
      description,
      message: 'Razorpay is temporarily unavailable. Please wait a moment and try again.',
    };
  }

  return {
    statusCode,
    code,
    description,
    message: 'Razorpay could not create the payment order. Check the Test Mode configuration and try again.',
  };
}
