import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ui");

  return {
    title: t("sjaTermsOfService"),
  };
}

export default function Page() {
  const t = useTranslations("ui");

  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-10 [&_h1]:text-3xl [&_h2]:pt-4 [&_h2]:text-xl [&_h3]:pt-2 [&_p]:leading-7">
      <p className="text-right font-bold">{t("lastUpdatedJanuary252025")}</p>
      <p className="text-right font-bold">{t("effectiveDateJanuary252025")}</p>

      <h1>{t("sjaTermsOfService2")}</h1>

      <p>{t("welcomeToTheSjaAnalyzerWebsiteTheSite")}</p>

      <p>{t("toUseSjaServicesCarefullyReadAndComplyWith")}</p>

      <p>{t("forQuestionsAboutTheseTermsContactTheDeveloperAt")}</p>

      <h2> {t("1AcceptanceOfTheAgreement")}</h2>

      <p>{t("thisAgreementGovernsYourUseOfTheSiteRead")}</p>

      <h2>{t("2UserAccounts")}</h2>

      <p>{t("keepYourAccountAndPasswordConfidentialYouAreResponsible")}</p>

      <p>{t("accountInformationMustNotIncludeAnyOfTheFollowing")}</p>

      <p>{t("1ContentThatViolatesTheConstitutionOrApplicableLaws")}</p>

      <p>{t("2ContentThatEndangersNationalSecurityDisclosesStateSecrets")}</p>

      <p>{t("3ContentThatHarmsNationalHonorNationalInterestsOr")}</p>

      <p>{t("4ContentThatIncitesEthnicHatredOrDiscriminationOr")}</p>

      <p>{t("5ContentThatUnderminesNationalReligiousPoliciesOrPromotes")}</p>

      <p>{t("6RumorsThatDisruptPublicOrderOrSocialStability")}</p>

      <p>
        {t("7ObscenePornographicGamblingViolentMurderousOrTerroristContent")}
      </p>

      <p>{t("8ContentThatInsultsOrDefamesOthersOrInfringes")}</p>

      <p>{t("9OtherContentProhibitedByLawsOrAdministrativeRegulations")}</p>

      <p> {t("sjaMayRestrictOrDenyAccessWhenAccountInformation")}</p>

      <h2> {t("3UserConduct")}</h2>

      <p>{t("youAreResponsibleForAllActivityUnderYourAccount")}</p>

      <p>{t("youAgreeToTheFollowing")}</p>

      <p>{t("1RespectTheLawsAndRegulatoryRequirementsOfThe")}</p>

      <p>{t("2DoNotMisuseTheSiteOrServicesTo")}</p>

      <p>{t("3FollowTheRulesAndProceduresOfThePlatform")}</p>

      <p>{t("ifThePlatformIdentifiesContentThatClearlyViolatesClause")}</p>

      <h2>{t("4Privacy")}</h2>

      <p>{t("youAcknowledgeAndAcceptTheSjaPrivacyPolicyAnd")}</p>

      <h2>{t("5Liability")}</h2>

      <p>{t("1YouAreResponsibleForAllContentYouStore")}</p>

      <p>{t("2TheSiteIsNotResponsibleForLossesCaused")}</p>

      <p>{t("3ThePlatformContinuallyChangesAndImprovesItsServices")}</p>

      <h2>{t("6ChangesToTheTerms")}</h2>

      <p>{t("theSiteMayAmendThisAgreementWhenNecessaryThrough")}</p>

      <h2>{t("7OpenSourceLicensesAndPolicies")}</h2>

      <p>{t("theFollowingListsOpenSourceProjectsAndTheirLicenses")}</p>

      <h3>（1）Tree edit distance using the Zhang Shasha algorithm</h3>
      <p>{t("projectTreeEditDistanceUsingTheZhangShashaAlgorithm")}</p>
      <p>{t("repositoryHttpsGithubComTimtadhZhangShasha")}</p>
      <p>{t("license")}</p>
      <p>
        Zhang-Shasha Tree Edit Distance Implementation is licensed under a BSD
        style license
      </p>

      <p>
        Copyright (c) 2012 Tim Henderson (tim.tadh@gmail.com) Stephen Johnson
        (steve@steveasleep.com) Copyright (c) 2015 Gustavo Sousa
        (gu_ludo@yahoo.com.br) Copyright (c) 2017 Erick R. Fonseca
        (erickrfonseca@gmail.com) All rights reserved.
      </p>

      <p>
        {" "}
        Redistribution and use in source and binary forms, with or without
        modification, are permitted provided that the following conditions are
        met:
      </p>

      <p>
        * Redistributions of source code must retain the above copyright notice,
        this list of conditions and the following disclaimer. * Redistributions
        in binary form must reproduce the above copyright notice, this list of
        conditions and the following disclaimer in the documentation and/or
        other materials provided with the distribution. * Neither the name of
        this software nor the names of its contributors may be used to endorse
        or promote products derived from this software without specific prior
        written permission.
      </p>

      <p>
        {" "}
        THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
        &quot;AS IS&quot; AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT
        NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
        FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
        HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
        SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
        TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
        PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
        LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
        NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
        SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
      </p>
    </div>
  );
}
