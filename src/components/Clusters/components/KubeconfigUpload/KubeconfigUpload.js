import React, { useCallback, useState } from 'react';
import { MessageStrip, Text } from '@ui5/webcomponents-react';
import { useTranslation } from 'react-i18next';
import { KubeconfigFileUpload } from './KubeconfigFileUpload';
import jsyaml from 'js-yaml';
import { Editor } from 'shared/components/MonacoEditorESM/Editor';

import { spacing } from '@ui5/webcomponents-react-base';
import './KubeconfigUpload.scss';

export function KubeconfigUpload({ kubeconfig, setKubeconfig }) {
  const [error, setError] = React.useState('');
  const [editor, setEditor] = useState(null);

  const { t } = useTranslation();

  const updateKubeconfig = useCallback(
    text => {
      try {
        const config = jsyaml.load(text);

        if (typeof config !== 'object') {
          setError(t('clusters.wizard.not-an-object'));
        } else {
          setKubeconfig(config);

          setError(null);
        }
      } catch ({ message }) {
        // get the message until the newline
        setError(message.substr(0, message.indexOf('\n')));
      }
    },
    [t, setError, setKubeconfig],
  );

  return (
    <div className="kubeconfig-upload">
      <KubeconfigFileUpload
        onKubeconfigTextAdded={text => {
          editor.getModel().setValue(text);
        }}
      />
      <Text className="editor-label" style={spacing.sapUiSmallMarginTopBottom}>
        {t('clusters.wizard.editor-label')}
      </Text>
      <Editor
        autocompletionDisabled
        language="yaml"
        value={kubeconfig ? jsyaml.dump(kubeconfig) : ''}
        onMount={setEditor}
        onChange={updateKubeconfig}
      />
      {error && (
        <MessageStrip
          design="Negative"
          hideCloseButton
          style={spacing.sapUiSmallMarginTop}
        >
          {t('common.create-form.editor-error', { error })}
        </MessageStrip>
      )}
    </div>
  );
}
