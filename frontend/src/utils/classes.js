import { 
    getDeepItem, 
    setDeepItem, 
    getOwnMethods, 
    getOwnProperties 
} from './funcs';
import { 
    Component, 
    Children, 
    cloneElement
} from "react";

export class NestedContainer extends Component {
    constructor(props) {
        super(props);
        this.childRefs = {};
    }

    setRef(element, index) {
        this.childRefs[index] = element;
    }

    children() {
        return Children.toArray(this.props.children);
    }

    injectProps(element, injector) {
        return cloneElement(element, {
            ...injector(element.props)
        });
    }

    countHorizontalChildren() {}
}

export class URLConfig {
    constructor(
        { protocol = 'http', host, port }, 
        prefix, inputConverter
    ) {
        this.origin = { protocol, host, port };
        this.prefix = prefix;
        this.inputConverter = inputConverter;
    }

    toString(path, queryParams) {
        const { protocol, host, port } = this.origin;
        let url = `${protocol}://${host}:${port}`;

        if (this.prefix) url += this.prefix;
        if (path !== null | undefined) url += path;

        if (queryParams && Object.keys(queryParams).length > 0) {
            const queryBuilder = new URLSearchParams();
    
            for (const [key, value] of Object.entries(
                this.inputConverter
                ? this.inputConverter(queryParams)
                : queryParams
            )) {
                queryBuilder.append(key, value);
            }

            url += `?${queryBuilder}`;
        }

        return url;
    }
};

export class HashMap {
    constructor(dictionary = {}) {
        this.dictionary = dictionary;
    }

    map(transform) {
        return Object.entries(this.dictionary)
        .map(([key, value]) => transform(key, value));
    }

    filter(predicate) {
        let copy = {};

        for (const [key, value] of Object.entries(this.dictionary)) {
            if (predicate(key, value)) copy[key] = value;
        }

        return new HashMap(copy);
    }

    forEach(consumer) {
        Object.entries(this.dictionary)
        .forEach(([key, value]) => consumer(key, value));
    }

    keys() {
        return Object.keys(this.dictionary);
    }

    values() {
        return Object.values(this.dictionary);
    }

    getItem(prop) {
        return this.dictionary[prop];
    }

    setItem(prop, value) {
        this.dictionary[prop] = value;
    }
};

export class DeepProxy {
    constructor(init = {}) {
        this._content = init;
        this._nestedAttributes = [];

        return new Proxy(this, DeepProxy);
    }

    getValue() {
        return getDeepItem(this._content, this.path());
    }

    setValue(newValue) {
        if (this._nestedAttributes.length > 0) {
            setDeepItem(this._content, this.path(), newValue);
        } else this._content = newValue;
    }

    clone() {
        const copy = new DeepProxy(this._content);

        this._nestedAttributes.forEach(copy._nestedAttributes.push);
        
        return copy;
    }

    path() {
        return this._nestedAttributes.join('.');
    }

    static get(target, prop, receiver) {
        const methods = getOwnMethods(target);
        const properties = getOwnProperties(target);

        if (Object.keys(properties).includes(prop)) return properties[prop];
        if (Object.keys(methods).includes(prop)) return methods[prop];

        const propReference = target.clone();

        propReference._nestedAttributes.push(prop);

        return propReference;
    }

    static set(obj, prop, value) {
        obj[prop].setValue(value);
    }
};