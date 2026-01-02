<template>
    <div class="w-full sm:mx-auto md:max-w-md">
        <div class="mt-4 flex items-center justify-between">
            <span class="border-input w-[35%] border-b dark:border-gray-600"></span>
            <span class="text-muted-foreground text-center text-xs uppercase">
                {{ $t('authentication.thirdPartyLogin') }}
            </span>
            <span class="border-input w-[35%] border-b dark:border-gray-600"></span>
        </div>

        <div class="mt-4 flex flex-wrap justify-center">
            <VbenIconButton class="mb-3"
                            :tooltip="$t('authentication.wechatLogin')"
                            tooltip-side="top">
                <SvgWeChatIcon />
            </VbenIconButton>
            <VbenIconButton class="mb-3"
                            :tooltip="$t('authentication.qqLogin')"
                            tooltip-side="top">
                <SvgQQChatIcon />
            </VbenIconButton>
            <VbenIconButton class="mb-3"
                            :tooltip="$t('authentication.githubLogin')"
                            tooltip-side="top">
                <SvgGithubIcon />
            </VbenIconButton>
            <VbenIconButton class="mb-3"
                            :tooltip="$t('authentication.googleLogin')"
                            tooltip-side="top">
                <SvgGoogleIcon />
            </VbenIconButton>
            <DingdingLogin v-if="dingdingAuthConfig"
                           class="mb-3"
                           :client-id="dingdingAuthConfig.clientId"
                           :corp-id="dingdingAuthConfig.corpId" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAppConfig } from "@vben/hooks";
import {
    SvgGithubIcon,
    SvgGoogleIcon,
    SvgQQChatIcon,
    SvgWeChatIcon,
} from "@vben/icons";
import { $t } from "@vben/locales";

import { VbenIconButton } from "@vben-core/shadcn-ui";

import DingdingLogin from "./dingding-login.vue";

defineOptions({
    name: "ThirdPartyLogin",
});

const {
    auth: { dingding: dingdingAuthConfig },
} = useAppConfig(import.meta.env, import.meta.env.PROD);
</script>
