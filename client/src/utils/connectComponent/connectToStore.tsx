import { connect } from "react-redux";

export type ConnectConfig = {
    mapStateToProps?: any,
    mapDispatchToProps?: any
}

export const connectToStore = (component: any, config: ConnectConfig) => {
    const { mapStateToProps, mapDispatchToProps } = config;
    return connect(mapStateToProps, mapDispatchToProps)(component);
}