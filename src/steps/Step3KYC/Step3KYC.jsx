import PanInput from "../../features/verification/components/PanInput";
import AadhaarInput from "../../features/verification/components/AadhaarInput";
import VoterIdField from "./fields/VoterIdField";
import PassportField from "./fields/PassportField";

function Step3KYC() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          KYC Verification
        </h2>

        <p className="mt-2 text-slate-500">
          Verify your PAN and Aadhaar before continuing.
        </p>
      </div>

      <PanInput />

      <AadhaarInput />

      <div className="grid gap-6 md:grid-cols-2">
        <VoterIdField />

        <PassportField />
      </div>
    </div>
  );
}

export default Step3KYC;