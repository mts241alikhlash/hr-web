# hr-web

## 0.1.1

### Patch Changes

- Remove the dead app-settings feature. No service serves `/settings`, so every boot fetched a 404 and fell back to static branding; the login screen, sidebar and menu now read that static branding directly, and the unreachable "Pengaturan Umum" screen and maintenance redirect are gone.
