import React, { useEffect } from 'react';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';

import styled from 'styled-components';
import { Button, Divider, Typography } from 'antd';
import { EditOutlined, ExpandAltOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import TabToolbar from '../../components/styled/TabToolbar';
import { AddLinkModal } from '../../components/styled/AddLinkModal';
import { EmptyTab } from '../../components/styled/EmptyTab';
import { DescriptionEditor } from './components/DescriptionEditor';
import { LinkList } from './components/LinkList';

import { useEntityData, useRefetch, useRouteToTab } from '../../EntityContext';
import { EDITED_DESCRIPTIONS_CACHE_NAME } from '../../utils';
import { Editor } from './components/editor/Editor';
import { DescriptionPreviewModal } from './components/DescriptionPreviewModal';

const DocumentationContainer = styled.div`
    margin: 0 32px;
    padding: 40px 0;
    max-width: calc(100% - 10px);
`;

interface Props {
    hideLinksButton?: boolean;
}

export const DocumentationTab = ({ properties }: { properties?: Props }) => {
    const hideLinksButton = properties?.hideLinksButton;
    const { urn, entityData } = useEntityData();
    const refetch = useRefetch();
    const description = entityData?.editableProperties?.description || entityData?.properties?.description || '';
    const links = entityData?.institutionalMemory?.elements || [];
    const localStorageDictionary = localStorage.getItem(EDITED_DESCRIPTIONS_CACHE_NAME);

    const routeToTab = useRouteToTab();
    const isEditing = queryString.parse(useLocation().search, { parseBooleans: true }).editing;
    const showModal = queryString.parse(useLocation().search, { parseBooleans: true }).modal;
    const { t } = useTranslation()
    useEffect(() => {
        const editedDescriptions = (localStorageDictionary && JSON.parse(localStorageDictionary)) || {};
        if (editedDescriptions.hasOwnProperty(urn)) {
            routeToTab({
                tabName: t('Documentation'),
                tabParams: { editing: true, modal: !!showModal },
            });
        }
    }, [urn, routeToTab, showModal, localStorageDictionary,t]);

    return isEditing && !showModal ? (
        <>
            <DescriptionEditor onComplete={() => routeToTab({ tabName: t('Documentation') })} />
        </>
    ) : (
        <>
            {description || links.length ? (
                <>
                    <TabToolbar>
                        <div>
                            <Button
                                data-testid="edit-documentation-button"
                                type="text"
                                onClick={() => routeToTab({ tabName: t('Documentation'), tabParams: { editing: true } })}
                            >
                                <EditOutlined /> {t('Edit')}
                            </Button>
                            {!hideLinksButton && <AddLinkModal buttonProps={{ type: 'text' }} refetch={refetch} />}
                        </div>
                        <div>
                            <Button
                                type="text"
                                onClick={() =>
                                    routeToTab({
                                        tabName: t('Documentation'),
                                        tabParams: { modal: true },
                                    })
                                }
                            >
                                <ExpandAltOutlined />
                            </Button>
                        </div>
                    </TabToolbar>
                    <div>
                        {description ? (
                            <Editor content={description} readOnly />
                        ) : (
                            <DocumentationContainer>
                                <Typography.Text type="secondary">{t('No documentation added yet.')}</Typography.Text>
                            </DocumentationContainer>
                        )}
                        <Divider />
                        <DocumentationContainer>
                            {!hideLinksButton && <LinkList refetch={refetch} />}
                        </DocumentationContainer>
                    </div>
                </>
            ) : (
                <EmptyTab tab={t("documentation")}>
                    <Button onClick={() => routeToTab({ tabName: t('Documentation'), tabParams: { editing: true } })}>
                        <EditOutlined /> {t('Add Documentation')}
                    </Button>
                    {!hideLinksButton && <AddLinkModal refetch={refetch} />}
                </EmptyTab>
            )}
            {showModal && (
                <DescriptionPreviewModal
                    editMode={(isEditing && true) || false}
                    description={description}
                    onClose={() => {
                        routeToTab({ tabName: t('Documentation'), tabParams: { editing: false } });
                    }}
                />
            )}
        </>
    );
};
