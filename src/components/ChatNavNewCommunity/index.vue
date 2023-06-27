<template>
  <v-navigation-drawer class="w-100" :model-value="navModelValue === website.navType.CHAT_NAV_NEW_COMMUNITY">
    <v-sheet style="background-color: #cc785c">
      <v-container class="pt-10">
        <v-row>
          <v-col cols="auto">
            <v-btn icon="mdi-keyboard-backspace" color="white" variant="text" @click.stop="handleBack"></v-btn>
          </v-col>
          <v-col cols="auto" class="text-center text-white text-h6" style="line-height: 3rem"> New community </v-col>
        </v-row>
      </v-container>
    </v-sheet>

    <v-sheet>
      <v-container class="pt-7 pl-7 pr-7 overflow-x-hidden overflow-y-auto">
        <v-row>
          <v-col cols="auto" class="w-100 text-center">
            <v-avatar rounded="xl" size="200" color="#6d7b85">
              <v-icon icon="mdi-account-group" size="130" color="#77838c"></v-icon>
            </v-avatar>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="auto" class="w-100 text-center">
            <v-text-field
              v-model="communityName"
              density="compact"
              placeholder="Community name"
              variant="underlined"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="auto" class="w-100 text-center">
            <v-textarea v-model="description" label="Community description"></v-textarea>
          </v-col>
        </v-row>
        <v-row v-if="communityName">
          <v-col cols="auto" class="w-100 text-center">
            <v-btn icon="mdi-check" color="#d4a27f" @click="handleNewCommunity"></v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
  import website from '@/config/website'
  import { ref } from 'vue'
  import { useUserStore } from '@/store/user'
  import { addCommunity } from '@/api/chat/community'

  defineProps({
    navModelValue: Number,
  })

  const emit = defineEmits(['popupMessage', 'changeModelValue'])

  const userStore = useUserStore()

  const communityName = ref('')
  const description = ref(
    'Hi everyone! This community is for members to chat in topic-based groups and get important announcements.',
  )

  function handleBack() {
    emit('changeModelValue', website.navType.CHAT_NAV_COMMUNITIES)
  }

  function handleNewCommunity() {
    const community = {
      communityName: communityName.value,
      adminId: userStore.id,
      description: description.value,
    }
    addCommunity(community)
      .then((res) => {
        if (res.code === 1) {
          emit('popupMessage', res.data.msg)
        }
      })
      .catch((err) => {
        // console.log(err.response.data.msg)
        emit('popupMessage', err.response.data.msg)
      })
  }
</script>
