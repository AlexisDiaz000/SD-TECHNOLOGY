export default function inlineEditPlugin() {
  return {
    name: 'vite-plugin-react-inline-editor',
    transform(code, id) {
      return code;
    }
  };
}
