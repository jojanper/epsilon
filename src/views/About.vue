<template>
  <div class="about">
    <h1>This is an about page</h1>
    <draal-nested-view class="w-25" :nodes="list"></draal-nested-view>
  </div>
</template>

<script>
import DraalNestedView from './Nested.vue';

export default {
    components: { DraalNestedView },
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
