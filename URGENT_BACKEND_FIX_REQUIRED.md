# URGENT: Backend API Fixes Required

## Problem 1: Missing Auth Token in Login Response
The login API (`POST /api/rest/login`) successfully authenticates users but **does NOT return an authentication token** in the response.

## Problem 2: Debug Output in Production API
The `/home_page_builder` endpoint is returning **PHP debug output** mixed with JSON, breaking the response format.

---

## Issue 1: Missing Authentication Token

### Impact
- Users cannot perform authenticated actions (wishlist, cart, profile)
- Frontend receives error: `"You must login or create an account to save item to your wish list"`
- App only works with public `client_token`, not user-specific tokens

### Current Login Response
```json
{
  "success": 1,
  "error": [],
  "data": {
    "customer_id": "80",
    "firstname": "Abdelrhman",
    "lastname": "Anani",
    "email": "abdelrhmanelanani20@gmail.com",
    "telephone": "96170123456"
  }
}
```

### Required Fix
Add `auth_token` or `access_token` field to the login response:

```json
{
  "success": 1,
  "error": [],
  "data": {
    "customer_id": "80",
    "firstname": "Abdelrhman",
    "lastname": "Anani",
    "email": "abdelrhmanelanani20@gmail.com",
    "telephone": "96170123456",
    "auth_token": "USER_AUTHENTICATION_TOKEN_HERE"  // ← ADD THIS
  }
}
```

---

## Issue 2: Debug Output in Production

### Impact
- Homepage API returns malformed response
- JSON parsing errors
- Unprofessional appearance in production

### Current Response
```
string(2) "80"
{"success":1,"error":[],"data":[...]}
```

### Problem
There's a PHP `var_dump()`, `print_r()`, or `echo` statement before the JSON output. This is likely in the `/home_page_builder` endpoint or a middleware.

### Required Fix
**Remove all debug statements from production code:**

```php
// REMOVE lines like these:
var_dump($customerId);           // ← REMOVE
echo "customer_id: " . $id;      // ← REMOVE
print_r($data);                  // ← REMOVE

// Output ONLY clean JSON:
header('Content-Type: application/json');
echo json_encode($response);
exit;
```

### How to Find It
1. Search codebase for `var_dump`, `print_r`, `echo`, `var_export` in production files
2. Check `/api/rest/home_page_builder` endpoint
3. Check any middleware or authentication filters
4. Look for debug code that outputs: `string(2) "80"`

---

## Alternative Acceptable Token Field Names
Any of these field names would work for the auth token:
- `data.auth_token` ✅ Preferred
- `data.access_token`
- `data.token`
- `token` (top level)
- `access_token` (top level)

---

## Steps to Fix Issue 1 (Auth Token)

### Option 1: Return JWT Token After Login
```php
// In your login controller
$response = [
    'success' => 1,
    'error' => [],
    'data' => [
        'customer_id' => $customer->id,
        'firstname' => $customer->firstname,
        'lastname' => $customer->lastname,
        'email' => $customer->email,
        'telephone' => $customer->telephone,
        'auth_token' => $this->generateUserToken($customer)  // ADD THIS
    ]
];
```

### Option 2: Use Existing OAuth Token System
If you already have an OAuth2 token system:
```php
// Generate token for the logged-in user
$token = $this->oauth->generateToken([
    'grant_type' => 'password',
    'client_id' => $clientId,
    'client_secret' => $clientSecret,
    'username' => $email,
    'password' => $password,
    'scope' => 'customer'
]);

$response['data']['auth_token'] = $token['access_token'];
```

---

## Testing

### Test Login Endpoint:
```bash
curl -X POST https://multi-store-api.cloudgoup.com/api/rest/login \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer CLIENT_TOKEN_HERE" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Expected response should include a token field!**

### Test Homepage Endpoint:
```bash
curl https://multi-store-api.cloudgoup.com/api/rest/home_page_builder \
  -H "Authorization: Bearer CLIENT_TOKEN_HERE"
```

**Expected: Clean JSON only, no debug output!**

---

## Additional Issues Found

### CORS Misconfiguration
There's also a CORS misconfiguration where `Access-Control-Allow-Credentials` header is being sent twice (`'true, true'` instead of `'true'`). Please check for duplicate CORS middleware.

---

## Urgency

1. **CRITICAL** - Auth token missing (blocks all user features)
2. **HIGH** - Debug output in production (breaks homepage, unprofessional)
3. **MEDIUM** - CORS duplicate headers

---

## Frontend Workaround Applied

I've added code to clean the debug output from the homepage response, but **this is a temporary fix**. The backend MUST be fixed to remove debug statements from production.

---

Contact: Frontend Developer  
Date: October 31, 2025
