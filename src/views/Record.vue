<template>
  <div>
    <div class="page-title">
      <h3>Новая запись</h3>
    </div>
    <Loader v-if="loading" />
    <p class="center" v-else-if="!categories.length">
      Категорий пока нет.
      <router-link to="/categories">Добавить новую категорию.</router-link>
    </p>
    <form class="form" v-else @submit.prevent="submitHandler">
      <div class="input-field">
        <select ref="select" v-model="category">
          <option v-for="c of categories" :key="c.id" :value="c.id">{{
            c.title
          }}</option>
        </select>
        <label>Выберите категорию</label>
      </div>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="income"
            v-model="type"
          />
          <span>Доход</span>
        </label>
      </p>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="outcome"
            v-model="type"
          />
          <span>Расход</span>
        </label>
      </p>

      <div class="input-field">
        <input
          id="amount"
          type="number"
          v-model.number="amount"
          :class="{ invalid: $v.amount.$dirty && !$v.amount.minValue }"
        />
        <label for="amount">Сумма</label>
        <span
          v-if="$v.amount.$dirty && !$v.amount.minValue"
          class="helper-text invalid"
          >Минимальная величина 1
        </span>
      </div>

      <div class="input-field">
        <input
          id="description"
          type="text"
          v-model="description"
          :class="{
            invalid: $v.description.$dirty && !$v.description.minValue
          }"
        />
        <label for="description">Описание</label>
        <span
          v-if="$v.description.$dirty && !$v.description.required"
          class="helper-text invalid"
          >Введите описание
        </span>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        Создать
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import Loader from "../components/app/Loader";
import { required, minValue } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";
export default {
  metaInfo: {
    title: "Новая запись"
  },
  name: "record",
  components: { Loader },
  data: () => ({
    loading: true,
    categories: [],
    select: null,
    category: null,
    type: "income",
    amount: 1,
    description: ""
  }),
  async mounted() {
    this.categories = await this.$store.dispatch("fetchCategories");
    this.loading = false;

    if (this.categories.length) {
      this.category = this.categories[0].id;
    }

    // eslint-disable-next-line no-undef
    setTimeout(() => {
      // eslint-disable-next-line no-undef
      this.select = M.FormSelect.init(this.$refs.select);
      // eslint-disable-next-line no-undef
      M.updateTextFields();
    }, 0);
  },
  destroyed() {
    if (this.select && this.select.destroy) {
      this.select.destroy();
    }
  },
  validations: {
    amount: { minValue: minValue(1) },
    description: { required }
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }

      if (this.canCreateRecord) {
        try {
          await this.$store.dispatch("createRecord", {
            categoryId: this.category,
            amount: this.amount,
            description: this.description,
            type: this.type,
            date: new Date().toJSON()
          });
          const bill =
            this.type === "income"
              ? this.info.bill + this.amount
              : this.info.bill - this.amount;
          await this.$store.dispatch("updateInfo", { bill });
          this.$message("Запись успешно создана");
          this.$v.$reset();
          this.amount = 1;
          this.description = "";
        } catch (e) {
          console.log(e);
        }
      } else {
        this.$message(
          `Недостаточно средств на счету (${this.amount - this.info.bill})`
        );
      }
    }
  },
  computed: {
    ...mapGetters(["info"]),
    canCreateRecord() {
      if (this.type === "income") {
        return true;
      }
      return this.info.bill >= this.amount;
    }
  }
};
</script>
