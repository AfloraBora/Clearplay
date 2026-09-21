# Privacy and listing copy

Audited local source: Brownout 1.2.0; Clearplay 1.1.0. These statements describe these versions, not a guarantee about future changes. This is listing guidance, not a completed Chrome Web Store privacy questionnaire.

## Shared short description of privacy

Free to use. No ads added by the extension, no analytics, no sale of user data, and no developer-operated data collection servers. Settings stay in your browser. Neither extension requests access to Chrome’s browsing-history database.

Avoid “no permissions,” “cannot access any data,” “100% private,” or “everything stays on your device” without qualification. Both extensions can read and modify their supported website. Website operators continue their normal data processing.

## Brownout — ready-to-paste privacy explanation

Brownout runs on x.com to display account-location labels and apply the filters you choose. Rules, saved profiles, personal country notes and cached account-location results are stored locally in your browser. Brownout does not send this data to the developer and does not include analytics or advertising. It does not request Chrome browsing-history access.

To retrieve X’s “About this account” location, Brownout sends account-handle lookups directly to X using your existing signed-in session. It temporarily uses authentication and anti-CSRF headers from X’s own requests in page memory; these headers are not saved in extension storage, included in settings exports or sent to the developer. X receives and processes these requests. No separate Brownout account is required.

Account location is X’s estimate, not verified residence or nationality. Personal country notes are explicitly marked as set by you. A temporary review drawer retains filtered-match metadata in the current tab, not post text. Settings exports are user-initiated files and include personal notes and profiles; users control whether to share them.

## Clearplay — ready-to-paste privacy explanation

Clearplay runs on www.youtube.com to apply your preferred playback quality. Preferences are stored locally in your browser. Current playback-quality and buffering status are processed locally, with temporary per-tab status in browser-session storage. Clearplay does not record a watch-history log, collect account identifiers, or request Chrome browsing-history access. No separate Clearplay account is required.

The extension makes no independent network requests and sends no data to the developer. YouTube continues to stream video and process its normal website activity. Click sounds are generated locally. Clearplay adds no advertising or analytics.

## Permissions and why they are needed

| Access | Brownout | Clearplay |
|---|---|---|
| storage | Save filter rules, notes, profiles, cache and operational state locally | Save preferences locally and temporary playback status per tab |
| Site content scripts | https://x.com/* — read account/post context, add labels, filter cards and perform X-only account lookups | https://www.youtube.com/* — interact with the player and show its status |
| Browsing-history permission | Not requested | Not requested |
| Cookies API permission | Not requested; existing X session is nevertheless used for authenticated X lookups | Not requested |
| tabs / all-sites permissions | Not requested | Not requested |

Chrome may describe site access as permission to read and change data on the supported site. That is broader than a single feature because content scripts run on the page; do not describe the technical permission as restricted only to public posts or video pixels. Their implemented behavior is narrower and can be inspected in the source. Calling chrome.tabs.query to identify the active tab for the popup does not mean the tabs or history permission has been requested.

## Transparency and open source

Before advertising either extension as “open source,” publish the corresponding source repository with an explicit open-source licence and retain third-party attribution/licence notices. A public repository without a licence is not sufficient. No licence choice or public repository has been created by this asset task. The supplied images therefore do not claim “open source” yet.

Once completed, add: “Open source: inspect the code, report issues and review each release at [your repository URL].” Link each store version to a matching source release/tag. Include support and privacy links. Do not put a placeholder URL into a live listing.

## Developer Dashboard

Describe the single purpose and site access accurately. Do not assume that local-only handling automatically makes every privacy checkbox “No.” Read each current field against the implementation: Brownout handles account handles, country estimates, locally supplied notes, page context and transient authentication headers; Clearplay handles playback state and preferences. Be transparent about X receiving Brownout lookups and distinguish this from data collection by the developer.

Official guidance:
- https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions
- https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts
- https://developer.chrome.com/docs/webstore/program-policies/policies
