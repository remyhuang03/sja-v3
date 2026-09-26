import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ui");

  return {
    title: t("sjaPrivacyPolicy"),
  };
}

export default function Page() {
  const t = useTranslations("ui");

  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-10 [&_h1]:text-3xl [&_h2]:pt-4 [&_h2]:text-xl [&_h3]:pt-2 [&_p]:leading-7">
      <p className="text-right font-bold">{t("lastUpdatedSeptember82023")}</p>
      <p className="text-right font-bold">{t("effectiveDateSeptember82023")}</p>

      <h1>{t("sjaPrivacyPolicy")}</h1>

      <p>{t("sjaAnalyzerValuesAndProtectsYourPersonalInformation")}</p>
      <p>{t("thisPolicyAppliesToAccessThroughSjaRemyaTop")}</p>
      <p>{t("readAndUnderstandAllProvisionsBeforeAcceptingThisPolicy")}</p>
      <p>{t("usingOrContinuingToUseTheAnalyzerIndicatesConsent")}</p>
      <p>{t("ifYouDoNotAgreeToTheCollectionOf")}</p>
      <p>{t("ifYouAreUnder18ReadThisPolicyWith")}</p>
      <h2>{t("1PurposesOfInformationCollection")}</h2>
      <h3>{t("11AnalysisAndServiceImprovement")}</h3>
      <p>{t("projectRetention")}</p>

      <h3>{t("12UserExperience")}</h3>
      <p>{t("cookiesAndOtherLocalStorageMayBeUsedTo")}</p>
      <p>{t("theServiceMayRecordReferringUrlsAssociatedWithReport")}</p>
      <p>{t("accountFeaturesMayAssociateAnAnalyzerAccountWithAn")}</p>

      <h3>{t("13OtherInformationRequiredByApplicableLawsAnd")}</h3>

      <h2>{t("2Contact")}</h2>
      <p>{t("forPersonalInformationInquiriesContactMeRemyaTop")}</p>
    </div>
  );
}
