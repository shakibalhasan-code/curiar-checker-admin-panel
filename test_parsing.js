// Test the API response parsing with your actual data structure
import { PhoneCheckService } from '../src/services/phoneCheckService';

// Your new API response with fraud details
const testApiResponse = {
    "pathao": {
        "user": {
            "phone": "01881143277"
        },
        "stats": {
            "success": 0,
            "cancel": 0,
            "total": 0
        }
    },
    "steadfast": {
        "user": {
            "phone": "01881143277"
        },
        "stats": {
            "success": 0,
            "cancel": 1,
            "total": 1
        },
        "fraud": {
            "phone": "01881143277",
            "name": "Imran",
            "details": "মানিকগঞ্জ দৌলতপুর দপ্তর একটা ****** পোলা বিজনমার জাত জন্মের ঠিক নাই এসব ****** পোলাদের পার্সেল পাঠানোর আগে শতবার ভেবে পার্সেল পাঠাবেন এবং ফুল পেমেন্ট হাতে পেয়ে এরপরে পাঠাবেন",
            "time": "2025-08-25T05:06:31.000000Z"
        }
    },
    "redx": {
        "user": {
            "phone": "01881143277"
        },
        "stats": {
            "success": "0",
            "cancel": 0,
            "total": "0"
        }
    },
    "ai_analysis": {
        "analysis": "উপলব্ধ তথ্য অনুযায়ী, ০১৮৮১১৪৩২৭ে নম্বরটির সাথে মাত্র একটি ব্যর্থ লেনদেন হয়েছে এবং ফ্রড রিপোর্ট করা হয়েছে।  ঝুঁকি স্তর মাঝারি থেকে উচ্চ।  এই নম্বরের সাথে ভবিষ্যতে কোন লেনদেন করার আগে সাবধানতা অবলম্বন করা উচিত।\n",
        "language": "bn",
        "summary": {
            "totalSuccess": 0,
            "totalCancel": 1,
            "totalParcels": 1,
            "hasFraudReport": true
        }
    },
    "cached": false
};

// Test the parsing
console.log('Testing API response parsing with fraud details...');
try {
    const parsed = PhoneCheckService.parsePhoneCheckResponse(testApiResponse);
    console.log('Parsed result:', JSON.stringify(parsed, null, 2));
    
    console.log('✅ Fraud Score:', parsed.fraudScore);
    console.log('✅ Risk Level:', parsed.riskLevel);
    console.log('✅ AI Analysis:', parsed.aiAnalysis?.analysis);
    console.log('✅ Total Success:', parsed.aiAnalysis?.summary?.totalSuccess);
    console.log('✅ Total Cancel:', parsed.aiAnalysis?.summary?.totalCancel);
    console.log('✅ Total Parcels:', parsed.aiAnalysis?.summary?.totalParcels);
    console.log('✅ Has Fraud Report:', parsed.aiAnalysis?.summary?.hasFraudReport);
    
    // Test courier data
    console.log('✅ Pathao data:', parsed.courier_checks?.pathao);
    console.log('✅ Steadfast data:', parsed.courier_checks?.steadfast);
    console.log('✅ RedX data:', parsed.courier_checks?.redx);
    
    // Test fraud details specifically
    if (parsed.courier_checks?.steadfast?.fraud && typeof parsed.courier_checks.steadfast.fraud === 'object') {
        console.log('✅ Steadfast fraud details found:');
        console.log('  - Name:', parsed.courier_checks.steadfast.fraud.name);
        console.log('  - Phone:', parsed.courier_checks.steadfast.fraud.phone);
        console.log('  - Time:', parsed.courier_checks.steadfast.fraud.time);
        console.log('  - Details:', parsed.courier_checks.steadfast.fraud.details);
    }
    
} catch (error) {
    console.error('❌ Error parsing response:', error);
}
