import {
    initDataFromSchema, TIMELINE_INPUT, TEXT_INPUT, GROUP_INPUT_WRAPPER
} from '../input';

const TEXT_DEF = {
    type: TEXT_INPUT,
    placeholder: 'Enter text',
    label: 'Text',
    name: 'text',
    rules: 'required'
};

const SCHEMA = [
    {
        ...TEXT_DEF
    },
    {
        type: TIMELINE_INPUT,
        placeholder: 'Enter timeline',
        label: 'Timeline',
        name: 'timeline',
        rules: 'required'
    },
    {
        type: GROUP_INPUT_WRAPPER,
        name: 'group',
        schema: [
            { ...TEXT_DEF }
        ]
    }
];

describe('Form input utilities', () => {
    it('initDataFromSchema', () => {
        const data = initDataFromSchema(SCHEMA);

        expect(data).toEqual({
            text: null,
            timeline: [],
            group: {
                text: null
            }
        });
    });
});
