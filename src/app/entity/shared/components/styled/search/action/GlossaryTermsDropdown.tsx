import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EntityType } from '../../../../../../../types.generated';
import EditTagTermsModal, { OperationType } from '../../../../../../shared/tags/AddTagsTermsModal';
import ActionDropdown from './ActionDropdown';

type Props = {
    urns: Array<string>;
    disabled: boolean;
    refetch?: () => void;
};

// eslint-disable-next-line
export default function GlossaryTermsDropdown({ urns, disabled = false, refetch }: Props) {
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [operationType, setOperationType] = useState(OperationType.ADD);
    const { t } = useTranslation()
    return (
        <>
            <ActionDropdown
                name={t("Glossary Terms")}
                actions={[
                    {
                        title: t('Add Glossary Terms'),
                        onClick: () => {
                            setOperationType(OperationType.ADD);
                            setIsEditModalVisible(true);
                        },
                    },
                    {
                        title: t('Remove Glossary Terms'),
                        onClick: () => {
                            setOperationType(OperationType.REMOVE);
                            setIsEditModalVisible(true);
                        },
                    },
                ]}
                disabled={disabled}
            />
            {isEditModalVisible && (
                <EditTagTermsModal
                    type={EntityType.GlossaryTerm}
                    visible
                    onCloseModal={() => {
                        setIsEditModalVisible(false);
                        refetch?.();
                    }}
                    resources={urns.map((urn) => ({
                        resourceUrn: urn,
                    }))}
                    operationType={operationType}
                />
            )}
        </>
    );
}
