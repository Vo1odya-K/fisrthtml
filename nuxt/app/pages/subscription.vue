<script setup>
useHead({
  title: 'Checkout'
})

const form = reactive({
  card: '',
  date: '',
  cvc: '',
  name: '',
  address: '',
  agree: false
})

const submit = async () => {
  if (!form.agree) {
    alert('Потрібно погодитись з умовами')
    return
  }

  await $fetch('/api/subscription/create', {
    method: 'POST',
    body: form
  })

  alert('Підписка створена!')
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6 text-black">

    <div class="max-w-6xl mx-auto">

      <!-- BACK -->
      <NuxtLink to="/" class="text-sm text-gray-500 mb-4 inline-block">
        &lt;&lt; back
      </NuxtLink>

      <h1 class="text-2xl font-bold mb-2">
        You’re Almost In - Start Your 3-Day Free Trial Now!
      </h1>

      <p class="text-gray-500 mb-6">
        Set up your account to gain instant access!
      </p>

      <div class="grid md:grid-cols-2 gap-6">

        <!-- RIGHT FORM -->
        <div class="bg-white rounded-xl border p-6 shadow text-black">

          <h2 class="font-semibold mb-4">Order Summary</h2>

          <div class="text-sm text-gray-600 mb-4 space-y-1">
            <div class="flex justify-between">
              <span>Annual Plan</span>
              <span>$2490.00</span>
            </div>
            <div class="flex justify-between">
              <span>Total Due</span>
              <span>$2490.00</span>
            </div>
            <div class="flex justify-between font-bold">
              <span>Due Today</span>
              <span>$0.00</span>
            </div>
          </div>

          <div class="bg-gray-100 text-center py-2 text-sm mb-4">
            Includes 3-Day Free Trial
          </div>

          <h3 class="font-semibold mb-2">Billing Information</h3>

          <!-- FORM -->
          <div class="space-y-4">

            <UInput v-model="form.card" placeholder="Card number" />

            <div class="grid grid-cols-2 gap-2">
              <UInput v-model="form.date" placeholder="MM/YY" />
              <UInput v-model="form.cvc" placeholder="CVC" />
            </div>

            <UInput v-model="form.name" placeholder="Full name" />
            <UInput v-model="form.address" placeholder="Address" />

            <div class="flex items-start gap-2 text-xs">
              <input type="checkbox" v-model="form.agree" />
              <span>
                I consent to Terms of Use and understand my 3-day free trial...
              </span>
            </div>

            <UButton block @click="submit">
              Try It Free
            </UButton>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>
