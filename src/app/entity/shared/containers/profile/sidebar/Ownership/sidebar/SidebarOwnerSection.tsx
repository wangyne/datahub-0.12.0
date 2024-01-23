import React, { useState } from 'react';
import { Typography, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
// import { ExpandedOwner } from '../../../../../components/styled/ExpandedOwner/ExpandedOwner';
import { EMPTY_MESSAGES } from '../../../../../constants';
import { Owner, OwnershipType, OwnershipTypeEntity } from '../../../../../../../../types.generated';
import { useEntityData, useMutationUrn, useRefetch } from '../../../../../EntityContext';
import { SidebarHeader } from '../../SidebarHeader';
import { EditOwnersModal } from '../EditOwnersModal';
import { ENTITY_PROFILE_OWNERS_ID } from '../../../../../../../onboarding/config/EntityProfileOnboardingConfig';
import { OwnershipTypeSection } from './OwnershipTypeSection';
import { getOwnershipTypeName } from '../ownershipUtils';

interface Props {
    properties?: any;
    readOnly?: boolean;
}

export const SidebarOwnerSection = ({ properties, readOnly }: Props) => {
    const { entityType, entityData } = useEntityData();
    const mutationUrn = useMutationUrn();

    const refetch = useRefetch();
    const [showAddModal, setShowAddModal] = useState(false);
    const ownersEmpty = !entityData?.ownership?.owners?.length;
    const ownershipTypesMap: Map<string, OwnershipTypeEntity> = new Map();
    const ownersByTypeMap: Map<string, Owner[]> = new Map();
    const { t } = useTranslation()
    entityData?.ownership?.owners?.forEach((owner) => {
        const ownershipType = owner?.ownershipType;
        const ownershipTypeName = getOwnershipTypeName(ownershipType);
        // If ownership type is not in the map, add it
        if (ownershipType && !ownershipTypesMap.has(ownershipTypeName)) {
            ownershipTypesMap.set(ownershipTypeName, ownershipType);
        }
        if (!ownersByTypeMap.has(ownershipTypeName)) {
            ownersByTypeMap.set(ownershipTypeName, []);
        }
        ownersByTypeMap.get(ownershipTypeName)?.push(owner);
    });
    // Sort ownership types by name alphabetically
    const ownershipTypeNames = Array.from(ownershipTypesMap.keys()).sort();

    let defaultOwnerTypeUrn = 'urn:li:ownershipType:__system__technical_owner';
    switch (properties?.defaultOwnerType) {
        case OwnershipType.TechnicalOwner:
            defaultOwnerTypeUrn = 'urn:li:ownershipType:__system__technical_owner';
            break;
        case OwnershipType.BusinessOwner:
            defaultOwnerTypeUrn = 'urn:li:ownershipType:__system__business_owner';
            break;
        case OwnershipType.DataSteward:
            defaultOwnerTypeUrn = 'urn:li:ownershipType:__system__data_steward';
            break;
        default:
            break;
    }
    const ownersTitleTrans = t(EMPTY_MESSAGES.owners.title);
    const ownersDescTrans = t(EMPTY_MESSAGES.owners.description);

    return (
        <div id={ENTITY_PROFILE_OWNERS_ID}>
            <SidebarHeader title={t("Owners")} />
            <div>
                {ownershipTypeNames.map((ownershipTypeName) => {
                    const ownershipType = ownershipTypesMap.get(ownershipTypeName) as OwnershipTypeEntity;
                    const owners = ownersByTypeMap.get(ownershipTypeName) as Owner[];
                    return <OwnershipTypeSection ownershipType={ownershipType} owners={owners} readOnly={readOnly} />;
                })}
                {ownersEmpty && (
                    <Typography.Paragraph type="secondary">
                        {ownersTitleTrans}. {ownersDescTrans}
                    </Typography.Paragraph>
                )}
                {!readOnly && (
                    <Button
                        type={ownersEmpty ? 'default' : 'text'}
                        onClick={() => setShowAddModal(true)}
                        data-testid="add-owners-button"
                    >
                        <PlusOutlined /> {t('Add Owners')}
                    </Button>
                )}
            </div>
            {showAddModal && (
                <EditOwnersModal
                    urns={[mutationUrn]}
                    defaultOwnerType={defaultOwnerTypeUrn}
                    hideOwnerType={properties?.hideOwnerType || false}
                    entityType={entityType}
                    refetch={refetch}
                    onCloseModal={() => {
                        setShowAddModal(false);
                    }}
                />
            )}
        </div>
    );
};
