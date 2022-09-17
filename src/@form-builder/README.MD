# Form Builder

This form builder using:

-   [yup](https://github.com/jquense/yup) as schema validator
-   [formik](https://formik.org/) as form state & validation

<br />
<br />

## Using Form Builder component

to rendering form builder component simply import component with:

```sh
import { FormBuilder } from "@form-builder";
```

and just simply render component with :

```sh
<FormBuilder />;
```

<br />

### SSR
for Server Side Rendering add extras import and step like this:

```sh
import { FormBuilder, resetServerContext } from "@form-builder";
```

and after that, in your pages / screen call the resetServerContext in getStaticProps / getServerSideProps :

```sh
export default function Home() {
    return <FormBuilder />;
};

export const getStaticProps = async (context) => {
    resetServerContext(); // call this function here
    return {
        props: {}, // will be passed to the page component as props
    };
};
```

### Props

props for FormBuilder
| Property | Type | Required | Default | Description |
| :-------------- | :-------------------------- | :---------------- | :---------------- | :------------------------------------------------------- |
| `defaultSchema` | `FormsShapes` | true | `undefined` | Default Form Schema to be render in initial render |

<br />
<br />

## Using Form Component

to rendering form from schema, first generate your schema from [here](https://his-ui.vercel.app/en/form-builder)
or loaded it from backend if you are using form-builder component
and then import render form component with:

```sh
import RenderFormComponent from "@form-builder/src/components/render";
```

and then render it into your component like this:

```sh
<RenderFormComponent
    formSchema={scheme}
    onHandleSubmit={() => {
        console.log("submit");
    }}
/>
```

### Props

props for RenderFormComponent
| Property | Type | Required | Default | Description |
| :-------------- | :-------------------------- | :---------------- | :---------------- | :------------------------------------------------------- |
| `formSchema` | `FormsShapes` | true | `undefined` | Form Schema to be render |
| `onHandleSubmit` | `(value) => void` | true | `undefined` | Handle action that will be triggered when submiting form, and passing all form values as an argument |
| `initialValue` | `any` | false | `undefined` | Default form value to be set in initial render |
| `btnSubmiTitle` | `string` | false | `submit` | The Button submit text will be shown |
| `setBtnLoading` | `boolean` | false | `false` | Set the state of button loading |
| `showJson` | `boolean` | false | `false` | Set the state for showing json object or not, this should be enable on development only for debuging form |
| `uiKit` | `chakra-ui` | false | `chakra-ui` | The other still on develop |

this component accept all react default div props.

```sh
React.HTMLProps<HTMLDivElement>
```
see this references [HTMLProps](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/1349b640d4d07f40aa7c1c6931f18e3fbf667f3a/types/react/index.d.ts#L1339)

<br />
<br />

# Guide for creating form schema with form builder

## Creating Form Layout

There are 2 concept element in this form builder, layout and field. layout will be act as wrapper element, meanwhile field will be act as form field.

Rules for wrapping layout structure:
1. `wizards` will be rendering as wizards / tabs element wrapper, this element can be placed on root / any node in the tree. `except inside forms layout`.
2. `accordions` will be rendering as accordions element wrapper, this element can be placed on root / any node in the tree. `except inside forms layout`.
3. `wrapper` will be rendering as ordinary div element that will wrap all the children tree without any special case, this element can be placed on root / any node in the tree. `except inside forms layout`. this element will be usefull to wrapping multiple accordions / wizards in single form element, just wrap those layout inside this element tree as children.
4. `forms` will be rendering to wraping all field in the form element. this one should be in the leaf node of layout tree structure. since u have been already created this layout, u will be able to create the field components inside this node element.
5. all of this layout will take `width 100%` by the parent element, in root case will be take up `width 100%` by the parent component of this FormBuilder wrapper.
```sh
<div style={{width: "1000px"}}>
  <FormBuilder />
</div>
```
eg: something like above, the root element will take up 100% of div component which is have 1000px width.

## Form layout Definition:

| Field | Value Type | Required | Default | Description |
| :-------------- | :-------------------------- | :---------------- | :---------------- | :------------------------------------------------------- |
| `title` | `string` | false | `empty string` | Text that will be rendering as Title element |
| `as` | `wizards | accordions | forms | wrapper` | true | `wizards` | These are 3 main layouts, all the field must be placed inside of forms layout in order to render in html tree structure |
| `refference id / refId` | `string of parent id` | false | `empty string` | this refId used to targeting parent element with attribute id, so the element will be rendering as children of refId element in html tree element structure |
| `active` | `boolean` | true | `true` | if set to false, then element will not be render in html tree element structure  |
| `hide title` | `boolean` | true | `false` | set to false in order u wanna hide the title text  |

<br />

## Creating Form Field

there are 3 tabs in this form.
1. `field data` collection of attribute field like label, name, type, etc
2. `configuration` extra configuration for field
3. `style` css to set style of field element, just simply set width of the element by the percentage `%` (this will auto calculated by the width of parent element) and then the element will try to take up the available space in the order. if the available space is less that the width you declare, then this field element will be placed in the next row.

<br />

### How to create dependencies field:

what is dependecies field? field that will run some action when some condition meet the requirement.
excample case:
- when u want to make KTP field shown & required when age field is >= 17 yo, then u must set KTP field to depended with age field with the sets of those rules (`by` = age, `condition` = greater or equal, `value` = 17) and action (show & required).
- when u want to make city field required when country field is filled, then u must set city field to depended with country field with the sets of those rules (`by` = country, `condition` = notEmpty, `value` set to blank) and action (required).

steps:
1. set isDepen to active / true
2. there will be 2 section value, dependencies rules and action. rules is sets of rules u wanna check in order to do the action of these dependencies when the condition meets the rules requirement.
3. rules will be consist of 3 field, `by` is the dependecies by this field name (you should fill it with attribute name value), `condition` the condition for `by` that must be fullfilled, `value` value for comparasion condition (==, !=, >, <, etc).
4. dependecies can holds more than 1 rules, but in the end all of those rules must be fullfilled / must be true (`behind the scene all rules validation will be executing with AND operator, rules-1 && rules-2 && ...rules-n`) in order to run the dependecies action.

<br />

### How to create affecting field:

what is affecting field? this one is the opposite of dependecies, while dependecies make current field depended by other field, affecting is cureent field will affecting other field. please dont be confused to decide when to use dependecies or affecting. `affecting is use just in case u wanna set other field values depended by this / current field`.
excample case:
- u wanna make age field autofill by date of birth field. so when u choose dob is 01-01-2000, then age field will be automatically calculate by current date - dob value. to do this, in dob field, set affecting `other` = age, and `action` = calculateDate.
- when u wanna make slug field autofill by name field value. to do this, in name field, set affecting `other` = slug, and `action` = setValue / setValueCamelCase in order u wanna tranform value into camel case style.

steps:
1. set isAffecting to active / true
2. affecting consist of 2 value, `other` is to assign other field that will take the effect of action, `action` is the action / effect u wanna apply into other field.
3. `action` value is consist of `calculateDate, setValue, setValueCamelCase`. other action still on develop.
4. affecting can holds more than 1 value. when u set of multiple affecting, then all of those `action` will be apply on each `other` fields value.
   
<br />

### How to create appendix field:

what is appendix field? field that can be adding multiple list of value.
excample case:
- when you wanna user can add multiple phone number by add more phone number field
- working experience / education history field, where user can add more than 1 working experience / education history

steps:
1. set isAppend to active / true.
2. there will shown new sets of field form that will be appended.
3. u can add more than 1 field to be appended.

<br />

## Add, Edit, remove Node ELement

all of these features can be find in the Component List Section.
add will be represent with plus (+) icon, edit with pencil icon, remove with trash icon.
click add in order u wanna add new node element in the tree for those parent.
<br />
<br />
`Please Take Note` when u click `add` in the forms layout, then form fields will be shown automatically since u `only-allowed` add field type element as the forms layout children.
<br />
Otherwise when u click `add` in the others layout type (except forms), form layouts will be shown automatically since u `cannot` add fields element outside forms layout children.

<br />

## Drag n Drop Node ELement

u can drag all element node type either layouts / fields. but u just can drag n drop the element in the same root / container.
<br />
More flexible drag n drop feature will be develop in the future.
