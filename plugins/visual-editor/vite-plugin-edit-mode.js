export default function editModeDevPlugin() {
  return {
    name: 'vite-plugin-edit-mode',
    transform(code, id) {
      return code;
    }
  };
}
