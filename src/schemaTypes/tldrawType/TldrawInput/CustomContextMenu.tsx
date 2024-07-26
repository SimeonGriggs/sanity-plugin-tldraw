// https://tldraw.dev/examples/ui/inline-behavior

import type {TLUiContextMenuProps} from 'tldraw'
import {
  ArrangeMenuSubmenu,
  ClipboardMenuGroup,
  ConversionsMenuGroup,
  ConvertToBookmarkMenuItem,
  ConvertToEmbedMenuItem,
  DefaultContextMenu,
  EditLinkMenuItem,
  FitFrameToContentMenuItem,
  GroupMenuItem,
  RemoveFrameMenuItem,
  ReorderMenuSubmenu,
  SelectAllMenuItem,
  TldrawUiMenuGroup,
  ToggleAutoSizeMenuItem,
  ToggleLockMenuItem,
  UngroupMenuItem,
  useEditor,
  useValue,
} from 'tldraw'

export function CustomContextMenu(props: TLUiContextMenuProps) {
  const editor = useEditor()

  const selectToolActive = useValue(
    'isSelectToolActive',
    () => editor.getCurrentToolId() === 'select',
    [editor],
  )

  return (
    <DefaultContextMenu {...props}>
      {selectToolActive && (
        <>
          <TldrawUiMenuGroup id="misc">
            <GroupMenuItem />
            <UngroupMenuItem />
            <EditLinkMenuItem />
            <ToggleAutoSizeMenuItem />
            <RemoveFrameMenuItem />
            <FitFrameToContentMenuItem />
            <ConvertToEmbedMenuItem />
            <ConvertToBookmarkMenuItem />
            <ToggleLockMenuItem />
          </TldrawUiMenuGroup>
          <TldrawUiMenuGroup id="modify">
            <ArrangeMenuSubmenu />
            <ReorderMenuSubmenu />
            {/* <MoveToPageMenu /> */}
          </TldrawUiMenuGroup>
          <ClipboardMenuGroup />
          <ConversionsMenuGroup />
          <TldrawUiMenuGroup id="select-all">
            <SelectAllMenuItem />
          </TldrawUiMenuGroup>
        </>
      )}
    </DefaultContextMenu>
  )
}
