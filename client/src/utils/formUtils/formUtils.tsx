import { ComponentType } from "react";
import { connect } from "react-redux";
import { ConfigProps, InjectedFormProps, reduxForm } from "redux-form";

export type MapStateToProps = (state: any, props: any) => any;

export const connectReduxForm = (
    Component: ComponentType<InjectedFormProps<any, any, string>> & any,
     mapStateToProps: MapStateToProps | null,
     mapDispatchToProps: any,
     config: ConfigProps
     ) => {
    return connect(mapStateToProps, mapDispatchToProps)(reduxForm({ ...config })(Component))
};