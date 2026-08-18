import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import WizardLayout from "../../components/wizard/WizardLayout";
import useWizardStore from "../../store/wizardStore";
import { loadValidDraft } from "../../utils/draftStorage";

function LoanApplicationPage() {
  const navigate = useNavigate();
  const draftChecked = useWizardStore((state) => state.draftChecked);
  const setDraftChecked = useWizardStore((state) => state.setDraftChecked);

  useEffect(() => {
    if (draftChecked) return;

    let isMounted = true;

    loadValidDraft().then((draft) => {
      if (!isMounted) return;

      if (draft) {
        navigate("/resume", { replace: true });
      } else {
        setDraftChecked(true);
      }
    });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftChecked]);

  return <WizardLayout />;
}

export default LoanApplicationPage;
