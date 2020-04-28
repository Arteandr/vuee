<template>
  <div>
    <div class="page-title">
      <h3>Счет</h3>

      <button class="btn waves-effect waves-light btn-small" @click="refresh">
        <i class="material-icons">refresh</i>
      </button>
    </div>
    <Loader v-if="loading" />
    <div class="row" v-else>
      <HomeBill :rates="currency.rates" />
    </div>
  </div>
</template>

<script>
import HomeBill from "@/components/HomeBill";
import Loader from "../components/app/Loader";
export default {
  metaInfo: {
    title: "Домашняя страница"
  },
  data: () => ({
    loading: true,
    currency: null
  }),
  components: {
    Loader,
    HomeBill
  },
  async mounted() {
    this.loading = false;
  },
  methods: {
    async refresh() {
      this.loading = true;
      this.currency = await this.$store.dispatch("fetchCurrency");
      this.loading = false;
    }
  }
};
</script>
