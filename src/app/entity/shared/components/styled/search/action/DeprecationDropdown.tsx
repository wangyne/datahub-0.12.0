import { message, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { useBatchUpdateDeprecationMutation } from '../../../../../../../graphql/mutations.generated';
import { UpdateDeprecationModal } from '../../../../EntityDropdown/UpdateDeprecationModal';
import ActionDropdown from './ActionDropdown';
import { handleBatchError } from '../../../../utils';

type Props = {
    urns: Array<string>;
    disabled: boolean;
    refetch?: () => void;
};

// eslint-disable-next-line
export default function DeprecationDropdown({ urns, disabled = false, refetch }: Props) {
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [batchUpdateDeprecationMutation] = useBatchUpdateDeprecationMutation();

    const batchUndeprecate = () => {
        batchUpdateDeprecationMutation({
            variables: {
                input: {
                    resources: [...urns.map((urn) => ({ resourceUrn: urn }))],
                    deprecated: false,
                },
            },
        })
            .then(({ errors }) => {
                if (!errors) {
                    message.success({ content: 'Marked assets as un-deprecated!', duration: 2 });
                    refetch?.();
                }
            })
            .catch((e) => {
                message.destroy();
                message.error(
                    handleBatchError(urns, e, {
                        content: `Failed to mark assets as un-deprecated: \n ${e.message || ''}`,
                        duration: 3,
                    }),
                );
            });
    };
    const { t } = useTranslation()
    return (
        <>
            <ActionDropdown
                name={t("Deprecation")}
                actions={[
                    {
                        title: t('Mark as deprecated'),
                        onClick: () => {
                            setIsEditModalVisible(true);
                        },
                    },
                    {
                        title: t('Mark as un-deprecated'),
                        onClick: () => {
                            Modal.confirm({
                                title: t(`Confirm Mark as un-deprecated`),
                                content: t(`Are you sure you want to mark these assets as un-deprecated?`),
                                onOk() {
                                    batchUndeprecate();
                                },
                                onCancel() {},
                                okText: 'Yes',
                                maskClosable: true,
                                closable: true,
                            });
                        },
                    },
                ]}
                disabled={disabled}
            />
            {isEditModalVisible && (
                <UpdateDeprecationModal
                    urns={urns}
                    onClose={() => {
                        setIsEditModalVisible(false);
                        refetch?.();
                    }}
                />
            )}
        </>
    );
}
