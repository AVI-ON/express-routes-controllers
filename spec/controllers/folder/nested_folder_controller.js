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
export function collection_action(req, res) {
  res.json({ msg: 'folder/nested_folder_controller/collection_action' });
}
export function member_action(req, res) {
  res.json({
    msg: `folder/nested_folder_controller/member_action_${req.params.nested_folder_controller_id}`,
  });
}
