<template>
  <div class="about">
    <h1>This is an about page</h1>
    <draal-nested-view class="w-25" :nodes="list"></draal-nested-view>

    <draal-wrapper-view :child="B">
      <span slot="d" slot-scope="{ emoji }">Special D Content with scoped data: {{ emoji }}</span>
    </draal-wrapper-view>
  </div>
</template>

<script>
import DraalNestedView from './Nested.vue';
import DraalWrapperView from './Wrapper.vue';

const A = {
    template: '<div><slot name="a">Default A Content</slot><slot>Default C</slot></div>'
};

const B = {
    template: '<div><slot name="b">Default B Content</slot></div>'
};

const C = {
    template: '<div><slot name="c">Default C Content</slot></div>'
};

const D = {
    template: '<div><slot name="d" emoji="🎉">Default D Content</slot></div>'
};

export default {
    components: { DraalNestedView, DraalWrapperView },
    data() {
        return {
            A,
            B,
            C,
            D,
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
                    text: 'Bar',
                    active: false
                },
                {
                    text: 'FooBar',
                    active: false
                },
                {
                    text: 'BarFoo',
                    active: false
                }
            ]
        };
    }
};
</script>
