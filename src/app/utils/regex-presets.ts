import { PresetItem } from '../models/regex.models';

export const REGEX_PRESETS: PresetItem[] = [
  {
    id: 'email',
    name: 'Email Address',
    category: 'Web & URLs',
    description: 'Matches standard RFC-compliant email addresses with user and domain parts.',
    pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
    flags: 'gm',
    testString: `Contact us at support@example.com or feedback@my-domain.co.uk!
Invalid emails: plainaddress, @missinguser.com, user@.com.my
Valid: dev.team+filter@cloud-service.io`,
    tags: ['email', 'web', 'contact', 'user'],
  },
  {
    id: 'phone',
    name: 'International Phone Number',
    category: 'Validation',
    description: 'Matches phone numbers with optional country code (+1, +91, etc.), area code and separators.',
    pattern: '\\+?[1-9]\\d{0,2}[\\s.-]?\\(?\\d{2,4}\\)?[\\s.-]?\\d{3,4}[\\s.-]?\\d{3,4}',
    flags: 'gm',
    testString: `Call office: +1 (555) 234-5678 or direct: +91 98765 43210.
UK standard: +44 20 7946 0958 or local format 0800-1111-22.`,
    tags: ['phone', 'mobile', 'international', 'telephony'],
  },
  {
    id: 'url',
    name: 'Web URL (HTTP / HTTPS)',
    category: 'Web & URLs',
    description: 'Matches complete HTTP and HTTPS URLs including port, path, query parameters, and fragments.',
    pattern: 'https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)',
    flags: 'gm',
    testString: `Explore our docs at https://angular.dev/overview?ref=regex#signals
Also check http://localhost:4200/api/v1/status or https://sub.domain.org/path/to/file.html?lang=en&sort=asc`,
    tags: ['url', 'http', 'https', 'web', 'link'],
  },
  {
    id: 'ipv4',
    name: 'IPv4 Address',
    category: 'Web & URLs',
    description: 'Validates strict 0-255 octet format for IPv4 addresses.',
    pattern: '\\b(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(?:\\.(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}\\b',
    flags: 'gm',
    testString: `Gateway is 192.168.1.1 and DNS is 8.8.8.8 or 1.1.1.1.
Broadcast address: 255.255.255.255.
Invalid octets: 256.100.0.1, 999.0.0.1 (not matched).`,
    tags: ['ip', 'ipv4', 'networking', 'server'],
  },
  {
    id: 'ipv6',
    name: 'IPv6 Address',
    category: 'Web & URLs',
    description: 'Matches standard 128-bit IPv6 hexadecimal addresses with colon separators.',
    pattern: '(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::1|fe80::[0-9a-fA-F:]+',
    flags: 'gm',
    testString: `Primary node: 2001:0db8:85a3:0000:0000:8a2e:0370:7334
Loopback node: ::1
Link-local: fe80::1ff:feee:4a8b`,
    tags: ['ip', 'ipv6', 'network', 'hex'],
  },
  {
    id: 'uuid',
    name: 'UUID / GUID (v1-v5)',
    category: 'Validation',
    description: 'Matches Universally Unique Identifiers in standard 8-4-4-4-12 hex format.',
    pattern: '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}',
    flags: 'gmi',
    testString: `Session Token: 123e4567-e89b-12d3-a456-426614174000
Customer UUID: c73bcdcc-2669-4bf6-81d3-e4ae73fb11fd
Trace ID: 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d`,
    tags: ['uuid', 'guid', 'identity', 'id'],
  },
  {
    id: 'hex-color',
    name: 'Hex Color Code',
    category: 'Formatting',
    description: 'Matches 3, 4, 6, or 8-digit CSS hexadecimal colors with # prefix.',
    pattern: '#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\\b',
    flags: 'gm',
    testString: `Primary brand: #4f46e5 (Indigo 600)
Accent: #06b6d4, Dark bg: #09090b, Pure white: #fff
Semi-transparent overlay: #00000080 or #f00f`,
    tags: ['css', 'color', 'hex', 'design'],
  },
  {
    id: 'credit-card',
    name: 'Credit Card Number',
    category: 'Identity & Finance',
    description: 'Matches Visa, MasterCard, Amex, Discover 13-16 digit cards with optional spaces or dashes.',
    pattern: '\\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\\b',
    flags: 'gm',
    testString: `Visa card: 4111222233334444
MasterCard: 5500000000000004
Amex: 378282246310005`,
    tags: ['card', 'finance', 'visa', 'mastercard', 'payment'],
  },
  {
    id: 'password',
    name: 'Strong Password Policy',
    category: 'Validation',
    description: 'Requires min 8 chars, at least 1 uppercase, 1 lowercase, 1 number, and 1 special symbol.',
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#^()_+\\-=])[A-Za-z\\d@$!%*?&#^()_+\\-=]{8,}$',
    flags: 'gm',
    testString: `ValidPass123!
P@ssw0rd2026_Secure
weakpass
NoSpecial123
alllowercase!1`,
    tags: ['password', 'auth', 'security', 'validation'],
  },
  {
    id: 'jwt',
    name: 'JWT (JSON Web Token)',
    category: 'Programming',
    description: 'Matches standard encoded 3-part Bearer JSON Web Tokens (Header.Payload.Signature).',
    pattern: 'eyJ[a-zA-Z0-9_-]*\\.eyJ[a-zA-Z0-9_-]*\\.[a-zA-Z0-9_-]+',
    flags: 'gm',
    testString: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyfQ.4pe_ZOmzgxQz0wR8_h5E3h6r4dI1t9Lg5w0Zk6N8j_M
Non-JWT string: invalid.token.value`,
    tags: ['jwt', 'token', 'auth', 'bearer', 'security'],
  },
  {
    id: 'html-tag',
    name: 'HTML Tag & Attributes',
    category: 'Programming',
    description: 'Matches opening, closing, or self-closing HTML/XML tags and attributes.',
    pattern: '<\\/?[a-zA-Z][a-zA-Z0-9]*(?:\\s+[^>]*)?\\/?>',
    flags: 'gm',
    testString: `<div class="container mx-auto" id="main">
  <h1 style="color: #4f46e5;">Welcome to Regex Pro</h1>
  <img src="/assets/logo.svg" alt="Logo" loading="lazy" />
  <p>Paragraph with <strong>bold</strong> text.</p>
</div>`,
    tags: ['html', 'xml', 'tag', 'dom', 'markup'],
  },
  {
    id: 'markdown-link',
    name: 'Markdown Link & Title',
    category: 'Programming',
    description: 'Extracts markdown [anchor text](url "optional title") combinations.',
    pattern: '\\[([^\\]]+)\\]\\((https?:\\/\\/[^\\s\\)]+)(?:\\s+"([^"]+)")?\\)',
    flags: 'gm',
    testString: `Check [Angular Signals](https://angular.dev/guide/signals "Angular Documentation") for reactive state!
Also read our [Regex Cheat Sheet](https://genpoputils.github.io/regex_tester/cheat-sheet) guide.`,
    tags: ['markdown', 'link', 'syntax', 'url'],
  },
  {
    id: 'indian-pan',
    name: 'Indian PAN Card',
    category: 'Identity & Finance',
    description: 'Matches Indian Permanent Account Number (5 letters, 4 digits, 1 letter: ABCDE1234F).',
    pattern: '[A-Z]{5}[0-9]{4}[A-Z]{1}',
    flags: 'gm',
    testString: `Taxpayer PAN details:
Individual: ABCDE1234F
Company: AAACR5055K
Invalid PAN: 12345ABCDE, ABCD12345E`,
    tags: ['india', 'pan', 'tax', 'identity', 'finance'],
  },
  {
    id: 'indian-aadhaar',
    name: 'Indian Aadhaar Number',
    category: 'Identity & Finance',
    description: 'Matches 12-digit Indian Aadhaar number with optional spaces or hyphens.',
    pattern: '\\b[2-9]{1}[0-9]{3}[\\s-]?[0-9]{4}[\\s-]?[0-9]{4}\\b',
    flags: 'gm',
    testString: `Aadhaar ID records:
9876 5432 1098
3456-7890-1234
567890123456
Invalid (starts with 0/1): 0123 4567 8901`,
    tags: ['india', 'aadhaar', 'uidai', 'identity'],
  },
  {
    id: 'gstin',
    name: 'Indian GSTIN Number',
    category: 'Identity & Finance',
    description: 'Matches 15-character Goods and Services Tax Identification Number (e.g. 27ABCDE1234F1Z5).',
    pattern: '\\b[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}\\b',
    flags: 'gm',
    testString: `Vendor Invoices:
Maharashtra GSTIN: 27ABCDE1234F1Z5
Delhi GSTIN: 07AAACR5055K1Z1
Karnataka: 29AAAAA0000A1Z5`,
    tags: ['gst', 'gstin', 'india', 'tax', 'invoice'],
  },
  {
    id: 'vehicle-number',
    name: 'Indian Vehicle Number Plate',
    category: 'Identity & Finance',
    description: 'Matches Indian vehicle registration numbers (State code, RTO, series, 4-digit number: DL 01 AB 1234 or MH12AB1234).',
    pattern: '\\b[A-Z]{2}[-\\s]?[0-9]{1,2}[-\\s]?(?:[A-Z]{1,3}[-\\s]?)?[0-9]{4}\\b',
    flags: 'gm',
    testString: `Registered plates:
DL 01 AB 1234
MH-12-DE-1433
KA05MC4567
WB 24 A 0001`,
    tags: ['vehicle', 'india', 'rto', 'plate', 'transport'],
  },
  {
    id: 'ifsc',
    name: 'Indian Bank IFSC Code',
    category: 'Identity & Finance',
    description: 'Matches 11-character Indian Financial System Code (4 letters, 0, 6 alphanumeric).',
    pattern: '\\b[A-Z]{4}0[A-Z0-9]{6}\\b',
    flags: 'gm',
    testString: `Bank IFSC routing:
HDFC0000123 (HDFC Bank)
SBIN0001234 (State Bank of India)
ICIC0000001 (ICICI Bank)
Invalid: HDFC1000123 (5th char must be 0)`,
    tags: ['ifsc', 'bank', 'india', 'neft', 'rtgs', 'finance'],
  },
  {
    id: 'upi',
    name: 'UPI ID / VPA',
    category: 'Identity & Finance',
    description: 'Matches Unified Payments Interface (UPI) virtual payment addresses (username@bank).',
    pattern: '[a-zA-Z0-9.\\-_]{2,256}@[a-zA-Z]{2,64}',
    flags: 'gm',
    testString: `Pay to:
quickpay.service@okaxis
merchant_store@icici
9876543210@paytm
user.account-123@ybl`,
    tags: ['upi', 'vpa', 'payment', 'india', 'finance'],
  },
  {
    id: 'pin-code',
    name: 'Indian Postal PIN Code',
    category: 'Identity & Finance',
    description: 'Matches 6-digit Indian Postal Index Number (starts with 1-9, optional space in middle).',
    pattern: '\\b[1-9][0-9]{2}\\s?[0-9]{3}\\b',
    flags: 'gm',
    testString: `Shipping addresses:
New Delhi: 110001
Mumbai: 400 001
Bengaluru: 560034
Kolkata: 700 029
Invalid (starts with 0): 012345`,
    tags: ['pincode', 'postal', 'zip', 'india', 'address'],
  },
  {
    id: 'date',
    name: 'Date (YYYY-MM-DD or DD/MM/YYYY)',
    category: 'Formatting',
    description: 'Matches ISO 8601 dates (YYYY-MM-DD) or international format (DD/MM/YYYY).',
    pattern: '(?:\\d{4}[-/.]\\d{2}[-/.]\\d{2})|(?:\\d{2}[-/.]\\d{2}[-/.]\\d{4})',
    flags: 'gm',
    testString: `Project deadlines:
Launch: 2026-10-15
Milestone 1: 2026/11/01
British formatted: 25/12/2026 or 01.01.2027`,
    tags: ['date', 'iso8601', 'calendar', 'time'],
  },
  {
    id: 'time',
    name: 'Time (12h / 24h with AM/PM)',
    category: 'Formatting',
    description: 'Matches 24-hour HH:MM:SS or 12-hour HH:MM AM/PM formats.',
    pattern: '(?:[01]?\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d)?(?:\\s?[APap][Mm])?',
    flags: 'gm',
    testString: `Schedule times:
09:30 AM
23:59:59
00:15
1:45 pm
18:00`,
    tags: ['time', 'clock', 'duration', 'schedule'],
  },
];
