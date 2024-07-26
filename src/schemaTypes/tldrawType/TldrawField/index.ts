import type {ObjectFieldProps} from 'sanity'

// Remove left indent and border from the default Object Field
export function TldrawField(props: ObjectFieldProps) {
  return props.renderDefault({...props, level: props.level - 1})
}
