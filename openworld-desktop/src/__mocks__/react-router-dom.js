/* eslint-env jest */
module.exports = {
  useLocation: jest.fn().mockReturnValue({
    pathname: "/",
    search: "",
    hash: "",
    state: null,
    key: "somekeyhere",
  }),
};
