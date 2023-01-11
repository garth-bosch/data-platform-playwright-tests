import {
  recordsAfterHook,
  reportsAfterHook,
  recordTypesAfterHook,
  locationsAfterHook,
  test as baseTest,
} from '@opengov/cit-base/build/base/base-test';
import {CreateRecordPage} from '../pages/create-record-page';
import {NavigationBarPage} from '../pages/navigation-bar-page';
import {ExploreReportsPage} from '../pages/explore-reports-page';
import {InternalRecordPage} from '../pages/ea-record-page';
import {RefundModalPage} from '../pages/record-pages/fees/refund-modal-page';
import {MyExportsPage} from '../pages/my-exports-page';
import {NotificationSettings} from '../pages/notification-settings-page';
import {RequestChanges} from '../pages/request-change-page';
import {ExploreAnalyticsPage} from '../pages/explore-analytics-page';
import {ExploreMapPage} from '../pages/explore-map-page';
import {InboxPage} from '../pages/inbox-page';
import {InspectPage} from '../pages/inspect-page';
import {LocationPage} from '../pages/location-page';
import {ProjectPage} from '../pages/project-page';
import {RecordStepInspectionPage} from '../pages/record-step-inspection-page';
import {RenewPage} from '../pages/renew-page';
import {SelectRecordTypePage} from '../pages/select-record-type-page';
import {OrganizationSettingsPage} from '../pages/system-settings-pages/organization-settings-page';
import {PublicPortalSettingsPage} from '../pages/system-settings-pages/public-portal-settings-page';
import {SsoSettingPage} from '../pages/system-settings-pages/sso-settings-page';
import {UserProfileSettingsPage} from '../pages/system-settings-pages/user-profile-settings-page';
import {AttachmentDesignerPage} from '../pages/record-type-settings-pages/attachment-designer-page';
import {DepartmentFormSettings} from '../pages/record-type-settings-pages/department-form-settings-page';
import {DocumentDesignerPage} from '../pages/record-type-settings-pages/document-designer-page';
import {FeeDesignerPage} from '../pages/record-type-settings-pages/fee-designer-page';
import {FormDesignerPage} from '../pages/record-type-settings-pages/form-designer-page';
import {RecordTypesSettingsPage} from '../pages/record-type-settings-pages/record-types-settings';
import {WorkflowDesignerPage} from '../pages/record-type-settings-pages/workflow-designer-page';
import {SystemSettingsPage} from '../pages/system-settings-pages/system-settings-page';
import {ChangeLocationModal} from '../pages/record-pages/location/change-location-page';
import {ActivityLogSettingsPage} from '../pages/system-settings-pages/activity-log-settings-page';
import {PaymentsSettingsPage} from '../pages/system-settings-pages/payments-settings-page';
import {ReportingSettingsPage} from '../pages/system-settings-pages/reporting-settings-page';
import {LocationDesignerPage} from '../pages/record-type-settings-pages/location-designer-page';
import {RenewalWorkflowDesignerPage} from '../pages/record-type-settings-pages/renewal-workflow-designer-page';
import {SystemSettingsAppStorePage} from '../pages/system-settings-pages/system-settings-app-store-page';

export const test = baseTest.extend<{
  //EA Page objects
  createRecordPage: CreateRecordPage;
  exploreReportsPage: ExploreReportsPage;
  exploreAnalyticsPage: ExploreAnalyticsPage;
  exploreMapPage: ExploreMapPage;
  internalRecordPage: InternalRecordPage;
  inboxPage: InboxPage;
  inspectPage: InspectPage;
  locationPage: LocationPage;
  refundModalPage: RefundModalPage;
  changeLocationModalPage: ChangeLocationModal;
  myExportsPage: MyExportsPage;
  navigationBarPage: NavigationBarPage;
  notificationSettingsPage: NotificationSettings;
  requestChanges: RequestChanges;
  recordPage: InternalRecordPage;
  projectPage: ProjectPage;
  recordStepInspectionPage: RecordStepInspectionPage;
  renewPage: RenewPage;
  selectRecordTypePage: SelectRecordTypePage;
  //System setting pages.
  organizationSettingPage: OrganizationSettingsPage;
  publicPortalSettingPage: PublicPortalSettingsPage;
  ssoSettingsPage: SsoSettingPage;
  systemSettingsPage: SystemSettingsPage;
  userProfileSettingsPage: UserProfileSettingsPage;
  //Record Types designer pages.
  attachmentDesignerPage: AttachmentDesignerPage;
  departmentFormSettingsPage: DepartmentFormSettings;
  documentDesignerPage: DocumentDesignerPage;
  feeDesignerPage: FeeDesignerPage;
  formDesignerPage: FormDesignerPage;
  locationDesignerPage: LocationDesignerPage;
  recordTypesSettingsPage: RecordTypesSettingsPage;
  workflowDesignerPage: WorkflowDesignerPage;
  renewalWorkflowDesignerPage: RenewalWorkflowDesignerPage;
  activityLogSettingsPage: ActivityLogSettingsPage;
  paymentsSettingsPage: PaymentsSettingsPage;
  reportingSettingsPage: ReportingSettingsPage;
  systemSettingsAppStorePage: SystemSettingsAppStorePage;
}>({
  createRecordPage: async ({page}, use) => {
    await use(new CreateRecordPage(page));
    //Records cleanup.
    await recordsAfterHook();
  },
  exploreReportsPage: async ({page}, use) => {
    await use(new ExploreReportsPage(page));
    //Reports cleanup.
    await reportsAfterHook();
  },
  exploreAnalyticsPage: async ({page}, use) => {
    await use(new ExploreAnalyticsPage(page));
  },
  exploreMapPage: async ({page}, use) => {
    await use(new ExploreMapPage(page));
  },
  internalRecordPage: async ({page}, use) => {
    await use(new InternalRecordPage(page));
  },
  inboxPage: async ({page}, use) => {
    await use(new InboxPage(page));
  },
  inspectPage: async ({page}, use) => {
    await use(new InspectPage(page));
  },
  locationPage: async ({page}, use) => {
    await use(new LocationPage(page));
    // Locations cleanup.
    await locationsAfterHook();
  },
  refundModalPage: async ({page}, use) => {
    await use(new RefundModalPage(page));
  },
  changeLocationModalPage: async ({page}, use) => {
    await use(new ChangeLocationModal(page));
    await locationsAfterHook();
  },
  myExportsPage: async ({page}, use) => {
    await use(new MyExportsPage(page));
  },
  navigationBarPage: async ({page}, use) => {
    await use(new NavigationBarPage(page));
  },
  notificationSettingsPage: async ({page}, use) => {
    await use(new NotificationSettings(page));
  },
  requestChanges: async ({page}, use) => {
    await use(new RequestChanges(page));
  },
  recordPage: async ({page}, use) => {
    await use(new InternalRecordPage(page));
  },
  projectPage: async ({page}, use) => {
    await use(new ProjectPage(page));
  },
  recordStepInspectionPage: async ({page}, use) => {
    await use(new RecordStepInspectionPage(page));
  },
  renewPage: async ({page}, use) => {
    await use(new RenewPage(page));
  },
  selectRecordTypePage: async ({page}, use) => {
    await use(new SelectRecordTypePage(page));
  },
  organizationSettingPage: async ({page}, use) => {
    await use(new OrganizationSettingsPage(page));
  },
  publicPortalSettingPage: async ({page}, use) => {
    await use(new PublicPortalSettingsPage(page));
  },
  ssoSettingsPage: async ({page}, use) => {
    await use(new SsoSettingPage(page));
  },
  systemSettingsPage: async ({page}, use) => {
    await use(new SystemSettingsPage(page));
  },
  userProfileSettingsPage: async ({page}, use) => {
    await use(new UserProfileSettingsPage(page));
  },
  attachmentDesignerPage: async ({page}, use) => {
    await use(new AttachmentDesignerPage(page));
  },
  departmentFormSettingsPage: async ({page}, use) => {
    await use(new DepartmentFormSettings(page));
  },
  documentDesignerPage: async ({page}, use) => {
    await use(new DocumentDesignerPage(page));
  },
  feeDesignerPage: async ({page}, use) => {
    await use(new FeeDesignerPage(page));
  },
  formDesignerPage: async ({page}, use) => {
    await use(new FormDesignerPage(page));
  },
  locationDesignerPage: async ({page}, use) => {
    await use(new LocationDesignerPage(page));
  },
  recordTypesSettingsPage: async ({page}, use) => {
    await use(new RecordTypesSettingsPage(page));
    // Clean up: UI based
    await recordTypesAfterHook();
  },
  workflowDesignerPage: async ({page}, use) => {
    await use(new WorkflowDesignerPage(page));
  },
  renewalWorkflowDesignerPage: async ({page}, use) => {
    await use(new RenewalWorkflowDesignerPage(page));
  },
  activityLogSettingsPage: async ({page}, use) => {
    await use(new ActivityLogSettingsPage(page));
  },
  paymentsSettingsPage: async ({page}, use) => {
    await use(new PaymentsSettingsPage(page));
  },
  reportingSettingsPage: async ({page}, use) => {
    await use(new ReportingSettingsPage(page));
  },
  systemSettingsAppStorePage: async ({page}, use) => {
    await use(new SystemSettingsAppStorePage(page));
  },
});
export {expect} from '@playwright/test';
