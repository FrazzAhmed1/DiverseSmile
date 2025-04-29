import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const changeLang = (e) => i18n.changeLanguage(e.target.value);

  return (
    <div className="language-selector">
      <label>
        Language:{' '}
        <select value={i18n.language} onChange={changeLang}>
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
      </label>
    </div>
  );
}
