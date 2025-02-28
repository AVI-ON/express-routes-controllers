export const options = {
  before: {},
};
export function index(req, res) {
  res.json({ msg: 'folder/nested_folder_controller/index' });
}
export function create(req, res) {
  res.json({ msg: 'folder/nested_folder_controller/create' });
}
export function show(req, res) {
  res.json({
    msg: `folder/nested_folder_controller/show_${req.params.nested_folder_controller_id}`,
  });
}
export function destroy(req, res) {
  res.json({
    msg: `folder/nested_folder_controller/destroy_${req.params.nested_folder_controller_id}`,
  });
}
export function update(req, res) {
  res.json({
    msg: `folder/nested_folder_controller/update_${req.params.nested_folder_controller_id}`,
  });
}
export function nested_controller_member(req, res) {
  res.json({
    msg: `folder/nested_folder_controller/nested_controller_member_${req.params.nested_folder_controller_id}`,
  });
}
