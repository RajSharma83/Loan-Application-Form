import FirstNameField from "./fields/FirstNameField";
import LastNameField from "./fields/LastNameField";
import EmailField from "./fields/EmailField";
import MobileField from "./fields/MobileField";
import AlternateMobileField from "./fields/AlternateMobileField";
import DateOfBirthField from "./fields/DateOfBirthField";
import GenderField from "./fields/GenderField";
import MaritalStatusField from "./fields/MaritalStatusField";
import ParentNameField from "./fields/ParentNameField";

function Step2PersonalInfo() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Personal Information
        </h2>

        <p className="mt-3 max-w-2xl text-slate-500">
          Please provide your personal details. These details will be
          used for identity verification and loan eligibility checks.
        </p>
      </div>

      {/* Form */}
      <div className="grid gap-6 md:grid-cols-2">
        <FirstNameField />

        <LastNameField />

        <ParentNameField name="fatherName" label="Father's Name" />

        <ParentNameField name="motherName" label="Mother's Name" />

        <EmailField />

        <MobileField />

        <AlternateMobileField />

        <DateOfBirthField />

        <GenderField />

        <div className="md:col-span-2">
          <MaritalStatusField />
        </div>
      </div>
    </div>
  );
}

export default Step2PersonalInfo;