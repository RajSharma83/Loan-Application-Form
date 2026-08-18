import industries from "../../../steps/Step5Employment/constants/industries";
import {
  experienceYears,
  experienceMonths,
} from "../../../steps/Step5Employment/constants/experience";
import banks from "../../../steps/Step5Employment/constants/banks";
import designations from "../../../steps/Step5Employment/constants/designations";

const employmentRegistry = {
  salaried: {
    title: "Salaried Employment",

    sections: [
      {
        title: "Employment Details",

        fields: [
          {
            type: "autocomplete",
            name: "companyName",
            label: "Company Name",
            placeholder: "Search company...",
            required: true,
          },

          {
            type: "select",
            name: "industry",
            label: "Industry",
            required: true,
            options: industries,
          },

          {
            type: "autocomplete",
            name: "jobTitle",
            label: "Designation",
            placeholder: "Search designation...",
            required: true,
            options: designations,
            optionIcon: "designation",
          },

          {
            type: "currency",
            name: "monthlyIncome",
            label: "Monthly Income",
            required: true,
          },

          {
            type: "select",
            name: "salaryBank",
            label: "Salary Credit Bank",
            required: true,
            options: banks,
          },

          {
            type: "select",
            name: "experienceYears",
            label: "Experience (Years)",
            required: true,
            options: experienceYears,
          },

          {
            type: "select",
            name: "experienceMonths",
            label: "Experience (Months)",
            required: true,
            options: experienceMonths,
          },
        ],
      },

      {
        title: "Office Address",

        fields: [
          {
            type: "country",
            name: "officeCountry",
            label: "Country",
            required: true,
          },

          {
            type: "state",
            name: "officeState",
            countryName: "officeCountry",
            label: "State",
            required: true,
          },

          {
            type: "city",
            name: "officeCity",
            countryName: "officeCountry",
            stateName: "officeState",
            label: "City",
            required: true,
          },

          {
            type: "pin",
            name: "officePinCode",
            countryName: "officeCountry",
            stateName: "officeState",
            cityName: "officeCity",
            label: "PIN Code",
            required: true,
          },

          {
            type: "address1",
            name: "officeAddress1",
            label: "Address Line 1",
            required: true,
          },

          {
            type: "address2",
            name: "officeAddress2",
            label: "Address Line 2",
            required: false,
          },
        ],
      },
    ],
  },

  

  // =========================================================
  // SELF EMPLOYED
  // =========================================================

  selfEmployed: {
    title: "Self Employment",

    sections: [
      {
        title: "Business Details",

        fields: [
          {
            type: "text",
            name: "businessName",
            label: "Business Name",
            placeholder: "Enter business name",
            required: true,
          },

          {
            type: "text",
            name: "businessType",
            label: "Business Type",
            placeholder: "Software, Retail, etc.",
            required: true,
          },

          {
            type: "currency",
            name: "annualIncome",
            label: "Annual Income",
            required: true,
          },

          {
            type: "select",
            name: "yearsInBusiness",
            label: "Years In Business",
            required: true,
            options: experienceYears,
          },

          {
            type: "text",
            name: "gstNumber",
            label: "GST Number (if registered)",
            placeholder: "22AAAAA0000A1Z5",
            required: false,
          },

          {
            type: "text",
            name: "businessRegistrationNumber",
            label: "Business Registration Number",
            placeholder: "Enter registration/incorporation number",
            required: false,
          },
        ],
      },

      // -------------------------------------------------------
      // BUSINESS ADDRESS
      // -------------------------------------------------------

      {
        title: "Business Address",

        fields: [
          {
            type: "country",
            name: "businessCountry",
            label: "Country",
            required: true,
          },

          {
            type: "state",
            name: "businessState",
            countryName: "businessCountry",
            label: "State",
            required: true,
          },

          {
            type: "city",
            name: "businessCity",
            countryName: "businessCountry",
            stateName: "businessState",
            label: "City",
            required: true,
          },

          {
            type: "pin",
            name: "businessPinCode",
            countryName: "businessCountry",
            stateName: "businessState",
            cityName: "businessCity",
            label: "PIN Code",
            required: true,
          },

          {
            type: "address1",
            name: "businessAddress1",
            label: "Address Line 1",
            required: true,
          },

          {
            type: "address2",
            name: "businessAddress2",
            label: "Address Line 2",
            required: false,
          },
        ],
      },
    ],
  },

  // =========================================================
  // BUSINESS OWNER
  // =========================================================
  // Distinct from Self-Employed per the JD (Section B2, Step 5):
  // shares the same business-details/address shape, but GST Number
  // and Business Registration are REQUIRED here (they're optional
  // for a self-employed professional), and there's no separate
  // "Monthly Income" field — annual income/turnover covers it.

  businessOwner: {
    title: "Business Ownership",

    sections: [
      {
        title: "Business Details",

        fields: [
          {
            type: "text",
            name: "businessName",
            label: "Business Name",
            placeholder: "Enter business name",
            required: true,
          },

          {
            type: "text",
            name: "businessType",
            label: "Business Type",
            placeholder: "Software, Retail, etc.",
            required: true,
          },

          {
            type: "currency",
            name: "annualIncome",
            label: "Annual Business Turnover",
            required: true,
          },

          {
            type: "select",
            name: "yearsInBusiness",
            label: "Years In Business",
            required: true,
            options: experienceYears,
          },

          {
            type: "text",
            name: "gstNumber",
            label: "GST Number",
            placeholder: "22AAAAA0000A1Z5",
            required: true,
          },

          {
            type: "text",
            name: "businessRegistrationNumber",
            label: "Business Registration Number",
            placeholder: "Enter registration/incorporation number",
            required: true,
          },
        ],
      },

      {
        title: "Business Address",

        fields: [
          {
            type: "country",
            name: "businessCountry",
            label: "Country",
            required: true,
          },

          {
            type: "state",
            name: "businessState",
            countryName: "businessCountry",
            label: "State",
            required: true,
          },

          {
            type: "city",
            name: "businessCity",
            countryName: "businessCountry",
            stateName: "businessState",
            label: "City",
            required: true,
          },

          {
            type: "pin",
            name: "businessPinCode",
            countryName: "businessCountry",
            stateName: "businessState",
            cityName: "businessCity",
            label: "PIN Code",
            required: true,
          },

          {
            type: "address1",
            name: "businessAddress1",
            label: "Address Line 1",
            required: true,
          },

          {
            type: "address2",
            name: "businessAddress2",
            label: "Address Line 2",
            required: false,
          },
        ],
      },
    ],
  },

  // =========================================================
  // STUDENT
  // =========================================================

  student: {
    title: "Student Details",

    sections: [
      {
        title: "Education Details",

        fields: [
          {
            type: "text",
            name: "collegeName",
            label: "College Name",
            placeholder: "Enter college name",
            required: true,
          },

          {
            type: "text",
            name: "course",
            label: "Course",
            placeholder: "B.Tech, MBA...",
            required: true,
          },

          {
            type: "text",
            name: "graduationYear",
            label: "Graduation Year",
            placeholder: "2027",
            required: true,
          },
        ],
      },
    ],
  },

  // =========================================================
  // RETIRED
  // =========================================================

  retired: {
  title: "Retirement Details",

  sections: [
    {
      title: "Retirement Details",

      fields: [
        {
          type: "select",
          name: "retirementSector",
          label: "Employment Sector",
          required: true,
          options: [
            "Government",
            "Private",
          ],
        },

        {
          type: "text",
          name: "retirementCompanyName",
          label: "Previous Company / Organization",
          placeholder: "Enter company or organization name",
          required: true,
        },

        {
          type: "select",
          name: "retirementIndustry",
          label: "Industry",
          required: true,
          options: industries,
        },

        {
          type: "currency",
          name: "pensionAmount",
          label: "Monthly Pension",
          required: true,
        },
      ],
    },
  ],
},
};

export default employmentRegistry;