<template>
  <component :is="child">
    <template v-for="(_, name) in $slots" v-slot:[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </component>
  <!--div :is="child"-->
  <!--slot v-for="(_, name) in $slots" :name="name" :slot="name" />
    <template v-for="(_, name) in $scopedSlots" :slot="name" slot-scope="slotData">
      <slot :name="name" v-bind="slotData" />
  </template-->

  <!-- pass through scoped slots -->
  <!--template v-for="(_, scopedSlotName) in $scopedSlots" v-slot:[scopedSlotName]="slotData">
      <slot :name="scopedSlotName" v-bind="slotData" />
  </template-->

  <!-- pass through normal slots -->
  <!--template v-for="(_, slotName) in $slots" v-slot:[slotName]>
      <slot :name="slotName" />
  </template-->
  <!--/div-->
</template>

<script>
// https://gist.github.com/loilo/73c55ed04917ecf5d682ec70a2a1b8e2
export default {
    name: 'DraalWrapperView',
    props: ['child']
};
</script>
