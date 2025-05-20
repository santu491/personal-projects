declare module '@crediblemind/embeddable-react-native' {
  import { ComponentType } from 'react';

  interface CMEmbeddableProps {
    clientIdentifier: string;

    env: string;

    components: string;

    ref?: React.Ref<WebView | null>;

    onNavigationStateChange?: (navState: { canGoBack: boolean }) => void;
  }

  const CMEmbeddable: ComponentType<CMEmbeddableProps>;

  export default CMEmbeddable;
}
