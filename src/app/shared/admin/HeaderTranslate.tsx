import React from 'react';
import { TranslationOutlined } from '@ant-design/icons';
import { Dropdown, Button } from 'antd';
import type { MenuProps } from 'antd';
import i18n from '../../../i18n/config'

export const HeaderTranslate: React.FC = () => {
    const changeLanguage = (lng:string) => {
        i18n.changeLanguage(lng);
        console.log(i18n);
    };
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <div
                    role="button"
                    tabIndex={0}
                    onClick={() => { changeLanguage('zh'); }}
                    onKeyPress={(e) => e.key === 'Enter' && i18n.changeLanguage('zh')}
                >
                    简体中文
                </div>
            ),
        },
        {
            key: '2',
            label: (
                <div
                    role="button"
                    tabIndex={0}
                    onClick={() => { changeLanguage('en'); }}
                    onKeyPress={(e) => e.key === 'Enter' && i18n.changeLanguage('en')}
                >
                    English
                </div>
            ),
        },
    ]
    return (
        <span>
      <Dropdown menu={{ items }}>
        <Button type="text" aria-hidden="true" onClick={(e) => e.preventDefault()}>
          <TranslationOutlined />
        </Button>
      </Dropdown>
    </span>
    );
};
