import Handler from "../factory/handler";
import Render from "../factory/render";
import {$set, dateFormat, isDate, isUndef} from "../core/util";
import {timeStampToDate, toDefSlot} from "../core/common";
import {creatorTypeFactory} from "../factory/creator";

const name = 'timePicker';

export function getTime(date) {
    return isDate(date)
        ? dateFormat('hh:mm:ss', date)
        : date;
}

class handler extends Handler {

    init() {
        let props = this.rule.props;
        if (!props.type) $set(props, 'type', 'time');
        if (isUndef(props.confirm)) $set(props, 'confirm', true);
    }

    toFormValue(value) {
        let parseValue, isArr = Array.isArray(value);
        if ('timerange' === this.rule.props.type) {
            if (isArr) {
                parseValue = value.map((time) => !time ? '' : getTime(timeStampToDate(time)));
            } else {
                parseValue = ['', ''];
            }
        } else {
            isArr && (value = value[0]);
            parseValue = !value ? '' : getTime(timeStampToDate(value));
        }
        return parseValue;
    }

    mounted() {
        super.mounted();
        this.rule.value = this.el.publicStringValue;
        this.vm._changeFormData(this.field, this.toFormValue(this.el.publicStringValue));
    }
}

class render extends Render {
    parse() {

        let {key, rule, vm} = this.handler;
        return [this.vNode.timePicker(this.inputProps().key(key).get(), toDefSlot(rule.defaultSlot, vm.$createElement, rule))];
    }
}

const maker = {
    time: creatorTypeFactory(name, 'time'),
    timeRange: creatorTypeFactory(name, 'timerange')
};

export default {handler, render, maker, name};
