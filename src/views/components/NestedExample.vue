<template>
  <draal-nested-view
    class="w-25"
    :nodes="list"
    @selected="clicked"
  ></draal-nested-view>
</template>

<script>
import DraalNestedView from '@/components/core/utils/Nested.vue';

export default {
    name: 'DraalExampleNested',
    components: {
        DraalNestedView
    },
    data() {
        return {
            list: [
                {
                    text: 'Foo',
                    active: false,
                    children: [
                        {
                            text: 'A',
                            active: false
                        },
                        {
                            text: 'B',
                            active: false
                        },
                        {
                            text: 'C',
                            active: false,
                            children: [
                                {
                                    text: 'A',
                                    active: false
                                }
                            ]
                        }
                    ]
                },
                {
                    text: 'Fuuas',
                    active: false,
                    children: [
                        {
                            text: 'AA',
                            active: false
                        },
                        {
                            text: 'BB',
                            active: false
                        }
                        /*
                        ,
                        {
                            text: 'C',
                            active: false,
                            children: [
                                {
                                    text: 'A',
                                    active: false
                                }
                            ]
                        }
                        */
                    ]
                },
                {
                    text: 'Bar',
                    active: false
                },
                {
                    text: 'FooBar',
                    active: false
                },
                {
                    text: 'BarFoo',
                    active: true
                }
            ]
        };
    },
    methods: {
        clicked(index, data) {
            console.log(index, data);
        }
    }
};
</script>
