<template>
  <v-row>
    <v-col class="d-flex" :class="message.inversion ? 'flex-row-reverse' : 'flex-row'">
      <v-sheet>
        <v-icon icon="mdi-account-circle" :size="46" color="#dfe5e7"></v-icon>
      </v-sheet>
      <v-sheet v-if="message.contentType === 5" color="#d9fdd3" class="rounded-lg pa-2 text-max-width text-min-width">
        <v-card>
          <v-card-title>Friend Request</v-card-title>
          <v-card-text>{{ message.content }}</v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <!-- <v-spacer></v-spacer> -->
            <!-- <v-btn color="green-darken-1" variant="text" @click="handleFriendRequest(false)"> Decline </v-btn> -->
            <v-btn color="green-darken-1" variant="text" @click="handleFriendRequest"> Accept </v-btn>
          </v-card-actions>
        </v-card>
        <p class="float-right datetime-font-size">{{ message.createTime }}</p>
      </v-sheet>
      <v-sheet v-else color="#d9fdd3" class="rounded-lg pa-2 text-max-width">
        <div>{{ message.content }}</div>
        <p class="float-right datetime-font-size">{{ message.createTime }}</p>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
  // import { useUserStore } from '@/store/user'
  import { addFriendRequest } from '@/api/chat/friend'
  // import { ChatMessage } from '#/db'

  const props = defineProps({
    message: Object,
  })

  // const userStore = useUserStore()

  function handleFriendRequest() {
    // 现在是消息的接受者回应请求
    const friendRequestData = {
      userId: props.message!.receiverId,
      friendId: props.message!.senderId,
      remark: '',
      requestStatus: 2,
      seqNum: String(Date.now()),
    }
    addFriendRequest(friendRequestData).then((res) => {
      console.log(res)
    })
  }
</script>

<style lang="scss">
  .text-max-width {
    max-width: 65%;
  }
  .text-min-width {
    min-width: 300px;
  }
  .datetime-font-size {
    font-size: 12px;
  }
</style>
