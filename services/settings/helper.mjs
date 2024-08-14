import { generatePresignedUrl } from "../../utils/s3.mjs";

const DEFAULT_ONBOARDING_SETTINGS = {
    primary_goals: [
        'Tracking Impact Metrics',
        'Finding Investment Opportunities',
        'Collaborating with Impact Orgs',
        'Research and Insights',
        'Showcasing your company’s impact',
        'Other'
    ],
    geo_focus: [
        'Local',
        'Regional',
        'National',
        'Global',
        'No Specific Preference'
    ],
    sectors_aligned: {
        'Industry/Sector Agnostic ':[],
        'Environmental': [
            'Renewable Energy',
            'Climate Change Mitigation',
            'Clean Technology Waste',
            'ManagementBiodiversity and Conservation',
            'Animal Welfare',
        ],
        'Social': [
            'Education',
            'Healthcare',
            'Affordable Housing',
            'Financial Inclusion',
            'Social Enterprise',
            'Gender Equality',
            'Human Rights and Justice',
            'Community Development',
            'Elderly Care',
            'Child and Youth Development'
        ],
        'Economic': [
            'AgricultureWater and Sanitation',
            'Sustainable Transportation',
            'MicrofinanceTechnology for Social Good',
            'Rural Development',
            'Urban Development',
            'Workforce Development',
            'Food Security',
            'Public Health',
        ],
        'Cultural':['Arts and Culture'],
        'Other':[]
    },
};

export const USER_TYPE= [
        {
          "name": "Social Impact Organization",
          "icon": "assets/img/ic_organization.png",
          "type": [
            "Nonprofit Organization (NPO)",
            "Non-Governmental Organization (NGO)",
            "For-Profit Impact Entity"
          ],
          "country": true,
          "business_no": true
        },
        {
          "name": "Investor",
          "icon": "assets/img/ic_investor.png",
          "type": [
            "Impact Investor",
            "Corporation",
            "Foundation"
          ],
          "country": false,
          "business_no": false
        },
        {
          "name": "Individual",
          "icon": "assets/img/ic_individual.png",
          "type": [],
          "country": false,
          "business_no": false
        }
]

// Default settings for web and mobile
export const DEFAULT_SETTINGS = {
    0: {  // Web settings
        dropdowns:  USER_TYPE,
        styles: {
            primaryColor: '#3498db',    
            secondaryColor: '#2ecc71',  
            tertiaryColor: '#e74c3c',   
            "logo": generatePresignedUrl('assets/1/images/logo.png'),
            "background_img": "assets/img/ic_bk.png"  
        },
    },
    1: {  // Mobile settings
        dropdowns: USER_TYPE,
        styles: {
            "primaryColor": "ff3C9C8C",
            "secondaryColor": "ffFF5733",
            'tertiaryColor': 'e74c3c',   
            "errorColor": "0xFFE74C3C",
            "logo": generatePresignedUrl('assets/1/images/logo.png'),
            "background_img": "assets/img/ic_bk.png"        
        },
    },
};

 