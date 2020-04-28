export default {
  bind(element, { value }) {
    // eslint-disable-next-line no-undef
    M.Tooltip.init(element, { html: value });
  },
  unbind(el) {
    // eslint-disable-next-line no-undef
    const tooltip = M.Tooltip.getInstance(el);
    if (tooltip && tooltip.destroy) {
      tooltip.destroy();
    }
  }
};
