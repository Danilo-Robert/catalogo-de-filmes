<template>
    <v-dialog max-width="500">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn
                  v-bind="activatorProps"
                  color="amber-darken-2"
                  text="Descrição"
                  variant="outlined"
                ></v-btn>
              </template>

              <template v-slot:default="{ isActive }">
                <v-card title="Descrição">
                  <v-card-text>
                    {{ filme.sinopse }}
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                      text="Fechar"
                      variant="outlined"
                      color="amber-darken-2"
                      @click="isActive.value = false"
                    ></v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
</template>

<script setup lang="ts">

</script>