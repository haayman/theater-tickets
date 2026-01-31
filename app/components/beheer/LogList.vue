<template>
  <v-container>
    <div class="m-3 form-inline noprint">
      <v-text-field v-model="filter" label="zoek" clearable @focus="$event.target.select()" />
    </div>

    <div class="loglist">
      <v-row
        v-for="log in filtered"
        :key="log.id"
        :style="log.reservering ? 'cursor: pointer' : ''"
        @click="goto(log)"
      >
        <v-col md="2">{{ formatDate(log.created_at, "dd-MM-yyyy H:mm") }}</v-col>
        <v-col
          v-if="log.reservering"
          md="4"
          v-html="emphasizeFilter(`${log.reservering.naam} ${log.reservering.email}`)"
        ></v-col>
        <v-col v-else md="4">(geannuleerd)</v-col>
        <v-col md="4">{{ log.message }}</v-col>
        <v-col md="1">
          <a
            v-if="log.reservering"
            :href="href(log)"
            target="_blank"
            title="Open in nieuw window"
            @click.stop=""
          >
            <v-icon>mdi-open-in-new</v-icon>
          </a>
        </v-col>
      </v-row>
      <InfiniteLoading @infinite="load">
        <template #complete> <div class="complete">Geen resultaten meer</div> </template>.
      </InfiniteLoading>
    </div>
  </v-container>
</template>

<script setup lang="ts">
// @ts-ignore
import InfiniteLoading from "v3-infinite-loading";
import { type ILog, Log } from "~~/models";
import "v3-infinite-loading/lib/style.css";

const filter = ref("");
const router = useRouter();
const logs = ref<Log[]>([]);
const { get } = useAPI();

const page = ref<number>(1);

// watch(page, (value) => {
//   router.replace({
//     name: route.name as string,
//     params: { page: value },
//   });
// });

const filtered = computed(() => {
  if (!filter.value) return logs.value;
  const regex = new RegExp(filter.value, "i");
  return logs.value.filter((log) => {
    const emailMatches = log.reservering?.email.match(regex);
    const nameMatches = log.reservering?.naam.match(regex);
    // console.log(log.reservering, emailMatches, nameMatches);
    return emailMatches || nameMatches;
  });
});

function decodeHtml(html: string) {
  const text = document.createElement("textarea");
  text.innerHTML = html;
  return text.value;
}

function emphasizeFilter(string: string) {
  const decoded = decodeHtml(string);
  if (!filter.value) return decoded;
  const regex = new RegExp(filter.value, "ig");
  const emphasized = string.replace(regex, "<b>$&</b>");
  return emphasized;
}

const load = async ($state: any) => {
  try {
    const data = await get<ILog[]>("/log", {
      params: {
        limit: 20,
        page: page.value - 1,
        include: ["reservering"],
      },
    });
    logs.value.push(...data.map((l) => new Log(l)));
    if (data.length < 20) {
      $state.complete();
    } else {
      page.value = page.value + 1;
      $state.loaded();
    }
  } catch (error) {
    console.error(error);
    $state.error();
  }
};

function getLink(row: Log) {
  if (row.reservering) {
    return {
      name: "reserveren-id-details",
      params: { id: row.reservering.id },
    };
  } else {
    return "";
  }
}

function href(row: Log) {
  const routeData = router.resolve(getLink(row));
  return routeData.href;
}

function goto(row: Log) {
  const link = getLink(row);
  if (link) router.push(link);
}
</script>

<style lang="scss">
:root {
  --loglist-even: #424242;
  --loglist-odd: #383838;
  --loglist-hover: rgb(105, 105, 105);
}

.loglist .v-row:nth-of-type(even) .v-col {
  background-color: var(--loglist-even);
}
.loglist .v-row:nth-of-type(odd) .v-col {
  background: var(--loglist-odd);
}

.loglist .v-row:hover .v-col {
  background: var(--loglist-hover);
}

.loglist .v-row a {
  text-decoration: none;
}

.loglist b {
  font-weight: 600;
}

.complete {
  margin-top: 2em;
  font-style: italic;

  hr {
    border-top-style: dashed;
    width: 50%;
  }
}
</style>
