"use client";

import useLocationModal from "@/app/hooks/useLocationModal";
import Modal from "./Modal";
import { useMemo, useState } from "react";
import Heading from "../Heading";
import { categories } from "../Categories";

// steps to creating a location
enum STEPS {
    NAME = 0,
    CATEGORY = 1,
    COUNTRY = 2,
    DESCRIPTION = 3,
    CITYDETAILS = 4,
    VISITEDON = 5,
    LOCATION = 6
}

const LocationModal = () => {
    const locationModal = useLocationModal();

    const [step, setStep] = useState(STEPS.NAME);

    const onBack = () => {
        setStep((value) => value - 1);
    }

    const onNext = () => {
        setStep((value) => value + 1);
    }

    const actionLabel = useMemo(() => {
        if (step === STEPS.LOCATION) {
            return 'Create';
        }
        return 'Next';
    }, [step]);

    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.NAME) {
            return undefined;
        }
        return 'Back'
    }, [step]);

    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading 
                title="Which place did you travel to?"
                subtitle="Write the location you visited"
            />
            <input 
                type="text" 
                autoFocus 
                placeholder="Where did you go? e.g. Toronto, Eiffel Tower, Lake Louise, Rubirosa, Mount Everest..." 
                className="border rounded px-2 py-1">
            </input>
        </div>
    )

    if (step === STEPS.CATEGORY) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading 
                    title="Which of these best describes the place you visited?"
                    subtitle="Pick a category (this step is optional!)"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
                    
                </div>
            </div>
        )
    }

    return(
        <Modal 
          isOpen={locationModal.isOpen}
          onClose={locationModal.onClose}
          onSubmit={locationModal.onClose}
          actionLabel={actionLabel}
          secondaryActionLabel={secondaryActionLabel}
          secondaryAction={step === STEPS.NAME ? undefined : onBack}
          title="Add a new location!"
          body={bodyContent}
        />
    );
}

export default LocationModal;